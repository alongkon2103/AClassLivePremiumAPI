-- Allow duplicate (function_id, gift_id) rows inside the same order so the same gift
-- can appear as multiple mappings under one function (e.g. two Rose rows, one active
-- one standby). The PK on id remains the only uniqueness guarantee for this table.

DROP INDEX IF EXISTS "user_function_gifts_user_id_order_id_function_id_gift_id_key";
