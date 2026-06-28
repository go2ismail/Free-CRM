using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;

namespace ASPNET.FrontEnd;

public class PageAuthorizationFilter : IPageFilter
{
    private static readonly string[] PublicPagePrefixes = new[]
    {
        "/Accounts/",
        "/Shared/"
    };

    private static readonly Dictionary<string, string> PageRoleMapping = new(StringComparer.OrdinalIgnoreCase)
    {
        { "/Dashboards/DefaultDashboard", "Dashboards" },
        { "/Campaigns/CampaignList", "Campaigns" },
        { "/Budgets/BudgetList", "Budgets" },
        { "/Expenses/ExpenseList", "Expenses" },
        { "/Leads/LeadList", "Leads" },
        { "/LeadContacts/LeadContactList", "LeadContacts" },
        { "/LeadActivities/LeadActivityList", "LeadActivities" },
        { "/SalesTeams/SalesTeamList", "SalesTeams" },
        { "/SalesRepresentatives/SalesRepresentativeList", "SalesRepresentatives" },
        { "/CustomerGroups/CustomerGroupList", "CustomerGroups" },
        { "/CustomerCategories/CustomerCategoryList", "CustomerCategories" },
        { "/Customers/CustomerList", "Customers" },
        { "/CustomerContacts/CustomerContactList", "CustomerContacts" },
        { "/VendorGroups/VendorGroupList", "VendorGroups" },
        { "/VendorCategories/VendorCategoryList", "VendorCategories" },
        { "/Vendors/VendorList", "Vendors" },
        { "/VendorContacts/VendorContactList", "VendorContacts" },
        { "/Products/ProductList", "Products" },
        { "/ProductGroups/ProductGroupList", "ProductGroups" },
        { "/PurchaseOrders/PurchaseOrderList", "PurchaseOrders" },
        { "/PurchaseOrders/PurchaseOrderPdf", "PurchaseOrders" },
        { "/SalesOrders/SalesOrderList", "SalesOrders" },
        { "/SalesOrders/SalesOrderPdf", "SalesOrders" },
        { "/SalesReports/SalesReportList", "SalesReports" },
        { "/PurchaseReports/PurchaseReportList", "PurchaseReports" },
        { "/TodoItems/TodoItemList", "TodoItems" },
        { "/Todos/TodoList", "Todos" },
        { "/Companies/MyCompany", "Companies" },
        { "/Taxs/TaxList", "Taxs" },
        { "/NumberSequences/NumberSequenceList", "NumberSequences" },
        { "/UnitMeasures/UnitMeasureList", "UnitMeasures" },
        { "/Profiles/MyProfile", "Profiles" },
        { "/Users/UserList", "Users" },
        { "/Roles/RoleList", "Roles" },
    };

    public void OnPageHandlerExecuting(PageHandlerExecutingContext context)
    {
        var pagePath = context.ActionDescriptor.ViewEnginePath;

        // Skip public pages (Accounts, Shared)
        foreach (var prefix in PublicPagePrefixes)
        {
            if (pagePath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                return;
        }

        // Skip root pages (Index, _ViewImports, _ViewStart)
        if (pagePath.Equals("/Index", StringComparison.OrdinalIgnoreCase) ||
            pagePath.Equals("/_ViewImports", StringComparison.OrdinalIgnoreCase) ||
            pagePath.Equals("/_ViewStart", StringComparison.OrdinalIgnoreCase))
            return;

        if (PageRoleMapping.TryGetValue(pagePath, out var requiredRole))
        {
            var user = context.HttpContext.User;
            if (user?.Identity?.IsAuthenticated != true)
            {
                context.HttpContext.Response.Redirect("/Accounts/Login");
                context.Result = new Microsoft.AspNetCore.Mvc.RedirectResult("/Accounts/Login");
                return;
            }

            var hasRole = user.Claims.Any(c =>
                c.Type == ClaimTypes.Role &&
                string.Equals(c.Value, requiredRole, StringComparison.OrdinalIgnoreCase));

            if (!hasRole)
            {
                context.HttpContext.Response.Redirect("/Accounts/Login?unauthorized=true");
                context.Result = new Microsoft.AspNetCore.Mvc.RedirectResult("/Accounts/Login?unauthorized=true");
                return;
            }
        }
        else
        {
            // Page not in mapping - redirect to login as a safety measure
            var user = context.HttpContext.User;
            if (user?.Identity?.IsAuthenticated != true)
            {
                context.HttpContext.Response.Redirect("/Accounts/Login");
                context.Result = new Microsoft.AspNetCore.Mvc.RedirectResult("/Accounts/Login");
                return;
            }
        }
    }

    public void OnPageHandlerExecuted(PageHandlerExecutedContext context) { }
    public void OnPageHandlerSelected(PageHandlerSelectedContext context) { }
}
