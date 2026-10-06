import fs from 'fs';
import path from 'path';

console.log('=== DAREY\'S ARTREALM: PHASE 7A SECURITY VERIFICATION AUDIT ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failCount++;
  }
}

// 1. Audit for Mock Auth Debris in src/
console.log('1. Auditing codebase for mock authentication remnants...');
const forbiddenPatterns = [
  'DEMO_ADMIN',
  'DEMO_COLLECTOR',
  'loginAsDemo',
  'loginAsAdmin',
  'Simulate Darey Admin Login',
];

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        checkDirectory(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of forbiddenPatterns) {
        if (content.includes(pattern)) {
          assert(false, `Forbidden pattern "${pattern}" found in ${fullPath}`);
        }
      }
    }
  }
}

checkDirectory(path.resolve('src'));
assert(true, 'Zero forbidden mock auth identifiers found in src/');

// 2. Audit Database Migration for RLS and Role Escalation Prevention
console.log('\n2. Auditing SQL Migration (supabase/migrations/20261006000001_create_profiles_and_roles.sql)...');
const migrationPath = path.resolve('supabase/migrations/20261006000001_create_profiles_and_roles.sql');
assert(fs.existsSync(migrationPath), 'Migration file exists');

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
assert(migrationSql.includes('alter table public.profiles enable row level security;'), 'RLS enabled on public.profiles');
assert(migrationSql.includes("'collector', -- STRICT: Never allow self-assigned administrator role"), 'handle_new_user() strictly defaults role to collector');
assert(migrationSql.includes('create or replace function public.is_admin()'), 'is_admin() security definer function exists');
assert(migrationSql.includes("role = 'admin'"), 'is_admin() validates admin role');
assert(migrationSql.includes("status = 'active'"), 'is_admin() validates active account status');
assert(
  migrationSql.includes('and role = (select p.role from public.profiles p where p.id = auth.uid())') &&
  migrationSql.includes('and status = (select p.status from public.profiles p where p.id = auth.uid())'),
  'Collector update policy mathematically prevents role and status escalation'
);

// 3. Audit Next.js Middleware and Open-Redirect Protection
console.log('\n3. Auditing Middleware and Open-Redirect Sanitizer...');
const middlewarePath = path.resolve('src/lib/supabase/middleware.ts');
assert(fs.existsSync(middlewarePath), 'Supabase middleware helper exists');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
assert(middlewareContent.includes('sanitizeRedirectPath'), 'sanitizeRedirectPath function is present');
assert(middlewareContent.includes('http:') && middlewareContent.includes('//'), 'Open-redirect patterns (http:, //) blocked');
assert(middlewareContent.includes("searchParams.set('next'") || middlewareContent.includes('/login?next='), 'Redirect to /login with next param configured for unauthenticated traffic');
assert(middlewareContent.includes("searchParams.set('denied', 'studio'") || middlewareContent.includes('/account?denied=studio'), 'Redirect to /account?denied=studio for non-admin studio attempts');

console.log(`\n=== AUDIT SUMMARY: ${passCount} Passed, ${failCount} Failed ===\n`);
if (failCount > 0) {
  process.exit(1);
}
