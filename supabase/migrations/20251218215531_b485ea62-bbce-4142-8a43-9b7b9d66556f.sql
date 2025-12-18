-- Link the recently generated PRD to the PRODAGO project
UPDATE prds 
SET project_id = 'a6132e32-2ce9-41de-8923-04740051f91b',
    title = 'PRODAGO PRD'
WHERE id = 'bcd2eb05-403f-4a36-b9c0-900b6dee85c1'
  AND project_id IS NULL;