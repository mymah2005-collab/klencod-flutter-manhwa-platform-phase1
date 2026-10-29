-- Seed data. Safe to re-run. Run after 0004_phase1_patches.sql.

-- Team roles (leader is stored on teams.leader_id, not here)
insert into team_roles (key, name_en, name_ar, sort_order) values
  ('co_leader', 'Co-Leader', 'نائب قائد', 1),
  ('editor', 'Typesetter / Editor', 'محرر', 2),
  ('translator', 'Translator', 'مترجم', 3),
  ('publisher', 'Publisher', 'ناشر', 4),
  ('member', 'Member', 'عضو', 5)
on conflict (key) do nothing;

-- Permission catalog. Keys match the checks used in the RLS policies.
insert into permissions (key, description) values
  ('team.manage_members', 'Invite and remove team members'),
  ('team.manage_webhook', 'Edit the team Discord webhook'),
  ('manhwa.create', 'Submit new manhwa for review'),
  ('manhwa.edit', 'Edit team manhwa (edits go back to review)'),
  ('manhwa.view_drafts', 'View unpublished team works'),
  ('chapter.upload', 'Upload chapters for review'),
  ('chapter.view_drafts', 'View unpublished team chapters')
on conflict (key) do nothing;

-- Default matrix. The owner edits it from the RBAC board.
-- The team leader holds every permission implicitly.
insert into role_permissions (role_key, permission_key, allowed) values
  ('co_leader', 'team.manage_members', true),
  ('co_leader', 'team.manage_webhook', true),
  ('co_leader', 'manhwa.create', true),
  ('co_leader', 'manhwa.edit', true),
  ('co_leader', 'manhwa.view_drafts', true),
  ('co_leader', 'chapter.upload', true),
  ('co_leader', 'chapter.view_drafts', true),
  ('editor', 'chapter.upload', true),
  ('editor', 'chapter.view_drafts', true),
  ('translator', 'chapter.upload', true),
  ('translator', 'chapter.view_drafts', true),
  ('publisher', 'manhwa.view_drafts', true),
  ('publisher', 'chapter.view_drafts', true),
  ('member', 'chapter.view_drafts', true)
on conflict do nothing;
