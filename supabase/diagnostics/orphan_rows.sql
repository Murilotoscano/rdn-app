-- ===========================================================================
-- POST-MIGRATION CHECK - READ ONLY
--
-- Run in the SQL editor after the four migrations, and again after any recovery.
-- It only counts; it changes nothing.
--
-- Expected result once attribution is done:
--
--     table_name         | orphan_rows | owned_rows
--     -------------------+-------------+-----------
--     error_log          |           0 |       ...
--     exam_history       |           0 |       ...
--     question_exposure  |           0 |       ...
--
-- A non-zero orphan_rows means those rows have no owner yet. They were NOT deleted:
-- they are still in the table, and row level security simply hides them, because the
-- policies compare auth.uid() with user_id and a null user_id is never a match. Recover
-- them with
--
--     select public.rdn_assign_orphan_rows();
--
-- ONLY when the project has exactly one account. With several accounts that call refuses
-- to run, on purpose: nothing in the row says which person the history belongs to, and
-- assigning it to the wrong account is not reversible from the data itself. In that case
-- decide who the owner is and pass the id, select public.rdn_assign_orphan_rows('<user id>').
-- ===========================================================================

select 'error_log' as table_name,
       count(*) filter (where user_id is null) as orphan_rows,
       count(*) filter (where user_id is not null) as owned_rows
from public.error_log
union all
select 'exam_history',
       count(*) filter (where user_id is null),
       count(*) filter (where user_id is not null)
from public.exam_history
union all
select 'question_exposure',
       count(*) filter (where user_id is null),
       count(*) filter (where user_id is not null)
from public.question_exposure
order by table_name;

-- Which accounts own rows, and how many. On a personal setup this is one account per
-- table with the same id in all three. More than one distinct id means two accounts were
-- used at some point; do not "fix" that by reassigning without deciding which is yours.
select coalesce(user_id::text, '(no owner)') as owner,
       count(*) filter (where src = 'error_log')         as error_log,
       count(*) filter (where src = 'exam_history')      as exam_history,
       count(*) filter (where src = 'question_exposure') as question_exposure
from (
    select user_id, 'error_log'         as src from public.error_log
    union all
    select user_id, 'exam_history'      from public.exam_history
    union all
    select user_id, 'question_exposure' from public.question_exposure
) rows_by_owner
group by 1
order by 1;
