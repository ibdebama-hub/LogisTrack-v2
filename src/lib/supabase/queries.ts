import { createClient } from '@supabase/supabase-js';
import { ImportedRow, ItemStatus, ItemType, PaymentStatus } from '../../types/logistrack';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FetchInvoicesOptions {
  organizationId: string;
  campaignId?: string;
  zoneId?: string;
  status?: ItemStatus;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchPaginatedInvoices(
  options: FetchInvoicesOptions
): Promise<PaginatedResult<ImportedRow>> {
  const page = options.page || 1;
  const pageSize = options.pageSize || 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase.rpc('get_paginated_invoices', {
    p_org_id: options.organizationId,
    p_campaign_id: options.campaignId || null,
    p_zone_id: options.zoneId || null,
    p_status: options.status || null,
    p_search: options.searchQuery || null,
    p_limit: pageSize,
    p_offset: from,
  });

  if (error || !data) {
    let query = supabase
      .from('items')
      .select('*, zones(code)', { count: 'exact' })
      .eq('organization_id', options.organizationId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (options.campaignId) query = query.eq('campaign_id', options.campaignId);
    if (options.status) query = query.eq('status', options.status);
    if (options.searchQuery) {
      query = query.or(
        `tracking_number.ilike.%${options.searchQuery}%,recipient_name.ilike.%${options.searchQuery}%`
      );
    }

    const res = await query;
    const itemsData = res.data || [];
    const count = res.count || itemsData.length;

    return {
      data: itemsData.map((i: any) => ({
        id: i.id,
        tracking_number: i.tracking_number,
        item_type: i.item_type as ItemType,
        payment_status: (i.payment_status || (Number(i.cod_amount) > 0 ? 'PENDING_COD' : 'NO_PAYMENT_REQUIRED')) as PaymentStatus,
        recipient_name: i.recipient_name,
        recipient_phone: i.recipient_phone,
        address_raw: i.address_raw,
        landmark_description: i.landmark_description,
        zone_code: i.zones?.code || 'UNASSIGNED',
        cod_amount: Number(i.cod_amount) || 0,
        due_date: i.due_date,
        status: 'valid',
        validation_errors: []
      })),
      totalCount: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

  const formattedRows: ImportedRow[] = data.map((i: any) => ({
    id: i.id,
    tracking_number: i.tracking_number,
    item_type: i.item_type as ItemType,
    payment_status: (i.payment_status || (Number(i.cod_amount) > 0 ? 'PENDING_COD' : 'NO_PAYMENT_REQUIRED')) as PaymentStatus,
    recipient_name: i.recipient_name,
    recipient_phone: i.recipient_phone,
    address_raw: i.address_raw,
    landmark_description: i.landmark_description,
    zone_code: i.zone_code || 'UNASSIGNED',
    cod_amount: Number(i.cod_amount) || 0,
    due_date: i.due_date,
    status: 'valid',
    validation_errors: []
  }));

  return {
    data: formattedRows,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function batchInsertInvoices(
  items: any[],
  chunkSize: number = 500,
  onProgress?: (processed: number, total: number) => void
): Promise<{ success: boolean; insertedTotal: number }> {
  const total = items.length;
  let insertedTotal = 0;

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    const { data, error } = await supabase.rpc('bulk_insert_invoices', {
      p_items_json: chunk,
    });

    if (error) {
      console.warn(`[Batch Chunk Error] Chunk ${i}-${i + chunk.length}:`, error.message);
      const { error: fallbackErr } = await supabase.from('items').upsert(chunk, {
        onConflict: 'tracking_number',
      });
      if (fallbackErr) {
        console.error('[Batch Insert Fallback Failed]', fallbackErr);
      } else {
        insertedTotal += chunk.length;
      }
    } else {
      insertedTotal += data || chunk.length;
    }

    if (onProgress) {
      onProgress(Math.min(i + chunkSize, total), total);
    }
  }

  return { success: true, insertedTotal };
}
