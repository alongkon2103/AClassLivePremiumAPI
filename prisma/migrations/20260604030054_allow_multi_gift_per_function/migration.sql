-- Allow many gifts per (user, order, function): drop the old (user_id, order_id, function_id)
-- unique constraint and replace with one that also includes gift_id. Add lookup indexes
-- so reverse-queries (by function or by gift) stay fast.

DROP INDEX IF EXISTS "user_function_gifts_user_id_order_id_function_id_key";

CREATE UNIQUE INDEX "user_function_gifts_user_id_order_id_function_id_gift_id_key"
  ON "user_function_gifts" ("user_id", "order_id", "function_id", "gift_id");

CREATE INDEX IF NOT EXISTS "idx_ufg_function" ON "user_function_gifts" ("function_id");
CREATE INDEX IF NOT EXISTS "idx_ufg_gift" ON "user_function_gifts" ("gift_id");
