# CLAUDE.md - Frontend Guidelines

Run `pnpm build` - To check that project builds

## Next.js Configuration

- App Router
- Internationalization with next-intl (en, sl, ge)
- Components organized within route directories in `_lib` folders

## Directory Structure

app/
\_lib/
components/
nav-menu.tsx
nav-user.tsx
OrganizationDropdown.tsx
organizations-settings.tsx
workspace-selector.tsx
ClientSidebar.tsx
DashboardLoader.tsx
useActiveUrlParams.tsx
[locale]/
(auth)/
get-started/
verify/
page.tsx
verification-form.tsx
page.tsx
register-form.tsx
login/
login-form.tsx
page.tsx
layout.tsx
[organizationId]/
\_lib/
organizationActions.ts
organizationsHooks.ts
[workspaceId]/
\_lib/
workspaceActions.ts
workspaceHooks.ts
charts/
\_ainalytics/
Ainalaytics.tsx
Ainalytics.tsx
DynamicChart.tsx
\_lib/
AssigneePerformanceChart.tsx
chartActions.ts
chartHooks.ts
Charts.tsx
CustomerOrderStatsChart.tsx
DailyOrderSumChart.tsx
ItemSalesChart.tsx
NewCustomersPerDayChart.tsx
OrdersPerDayChart.tsx
OrderStatusOverviewChart.tsx
TopSellingItemsChart.tsx
page.tsx
customers/
\_lib/
customerActions.ts
CustomerFormDrawer.tsx
customerHooks.ts
CustomersTable.tsx
page.tsx
discounts/
\_lib/
discountActions.ts
DiscountCodeFormDrawer.tsx
DiscountCodesTable.tsx
discountHooks.ts
page.tsx
inventory/
\_lib/
\_components/
Charts/
InventoryMovementsChart.tsx
InventoryStockChart.tsx
InventoryMovementsTable/
InventoryMovementsTable.tsx
InventoryTable/
InventoryFormDrawer.tsx
InventoryTable.tsx
inventoryActions.ts
inventoryHooks.ts
page.tsx
items/
\_lib/
itemActions.ts
ItemFormDrawer.tsx
itemsHooks.ts
ItemTable.tsx
page.tsx
orders/
\_lib/
\_components/
OrdersTable/
AssigneeCell.tsx
CustomerCell.tsx
OrdersTable.tsx
StatusCell.tsx
CustomerDropdown.tsx
ItemDropdown.tsx
ItemsNeededTable.tsx
OrderAudit.tsx
OrderForm.tsx
OrderItemRow.tsx
OrderNotes.tsx
orderActions.ts
ordersHooks.ts
[id]/
page.tsx
new/
page.tsx
page.tsx
taskforce/
\_lib/
\_components/
TasksTable/
TasksTable.tsx
TaskStatusCell.tsx
TimeEntryStatusCell.tsx
UserAssignmentCell.tsx
AdminTasksView.tsx
TaskForm.tsx
TaskSelect.tsx
TasksView.tsx
TimeEntries.tsx
TimeEntryDateTimePicker.tsx
TimeEntryDuration.tsx
TimeEntryForm.tsx
UserTasksView.tsx
taskforceActions.ts
taskforceHooks.ts
[id]/
edit/
page.tsx
page.tsx
new/
task/
page.tsx
time-entry/
page.tsx
page.tsx
layout.tsx
page.tsx
members/
lib/
memberActions.ts
MemberFormDrawer.tsx
membersHooks.ts
MembersTable.tsx
page.tsx
layout.tsx
page.tsx
auth/
authActions.ts
authHooks.ts
privacy/
page.tsx
profile/
layout.tsx
page.tsx
terms/
page.tsx
layout.tsx
not-found.tsx
page.tsx
manifest.ts
components/
data-table/
advanced/
data-table-advanced-faceted-filter.tsx
data-table-advanced-toolbar.tsx
data-table-filter-combobox.tsx
data-table-filter-item.tsx
data-table-multi-filter.tsx
hooks/
use-data-table.ts
use-debounce.ts
use-media-query.ts
use-query-string.ts
lib/
data-table.ts
export.ts
fonts.ts
config.ts
data-table-column-header.tsx
data-table-faceted-filter.tsx
data-table-pagination.tsx
data-table-skeleton.tsx
data-table-toolbar.tsx
data-table-view-options.tsx
data-table.tsx
generateColumnsFromZodSchema.tsx
types.ts
ui/
auto-form/
common/
label.tsx
tooltip.tsx
fields/
array.tsx
checkbox.tsx
date.tsx
enum.tsx
file.tsx
input.tsx
multiselector.tsx
number.tsx
object.tsx
radio-group.tsx
switch.tsx
textarea.tsx
config.ts
dependencies.ts
index.tsx
types.ts
utils.ts
accordion.tsx
alert-dialog.tsx
avatar.tsx
badge.tsx
breadcrumb.tsx
button.tsx
calendar.tsx
card.tsx
chart.tsx
checkbox.tsx
collapsible.tsx
command.tsx
date-picker-with-range.tsx
date-picker.tsx
date-range-picker.tsx
date-time-range-picker.tsx
dialog.tsx
drawer.tsx
dropdown-menu.tsx
form.tsx
input-otp.tsx
input.tsx
InputWithAddons.tsx
kbd.tsx
label.tsx
password-input.tsx
popover.tsx
radio-group.tsx
select.tsx
separator.tsx
sheet.tsx
sidebar.tsx
skeleton.tsx
slider.tsx
sonner.tsx
switch.tsx
table.tsx
tabs.tsx
textarea.tsx
toggle.tsx
tooltip.tsx
LocaleSwitcher.tsx
MemberDropdown.tsx
providers.tsx
theme-toggle.tsx
env/
clientEnvs.ts
serverEnvs.ts
hooks/
use-mobile.tsx
i18n/
request.ts
lib/
api.d.ts
apiClient.ts
authClient.ts
utils.ts
messages/
en.json
ge.json
sl.json
styles/
globals.css
utils/
storage.ts
config.ts
middleware.ts
navigation.ts

## UI & Component Patterns

- Tailwind CSS with shadcn/ui components based on Radix UI
- Component variants defined with class-variance-authority
- Forms: react-hook-form with zod validation
- Data tables: custom components with filtering and pagination
- Charts: recharts for data visualization
- Icons: lucide-react

## State Management

- TanStack Query (React Query) for API state
- React Context for global application state
- URL state with nuqs for query parameters
- Form state with react-hook-form

## API Integration

- Hono client for type-safe API calls
- Custom hooks in `*Hooks.ts` files
- API calls in `*Actions.ts` files
- Toast notifications for success/error states

## Code Style

- 2-space indentation, double quotes
- PascalCase for components, camelCase for functions/variables
- Use absolute imports with `@/` path aliases
- Server/client component segregation with "use client" directive
- Responsive design with mobile-first approach
- Object params functions (props: { smth: number })
