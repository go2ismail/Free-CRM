using Application.Common.Services.CleanerData;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataClean
{
    public class DatabaseCleanerService : IDatabaseCleanerService
    {
        private readonly DataContext _context;
        private readonly ILogger<DatabaseCleanerService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public DatabaseCleanerService(DataContext context, ILogger<DatabaseCleanerService> logger, IServiceProvider serviceProvider)
        {
            _context = context;
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public void RestoreSystem() {

            using(var scope = _serviceProvider.CreateScope())
            {
                var host = scope.ServiceProvider.GetService<IHost>();
                SeedManager.DI.SeedSystemData(host);
            }
        }

        async Task<CleanupReport> IDatabaseCleanerService.CleanAllDataAsync()
        {
            
            var report = new CleanupReport();
            int totalRemoved = 0;

            try
            {
                _logger.LogInformation("Début du processus de nettoyage complet de la base de données");

                // Commencer une transaction pour garantir l'intégrité des données
                //using var transaction = await _context.Database.BeginTransactionAsync();

                // Désactiver temporairement les contraintes de clé étrangère
                //await _context.Database.ExecuteSqlRawAsync("EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'");

                // Supprimer les données dans un ordre spécifique (inverse de l'ordre de seeding)

                // CRM
                //totalRemoved += await DeleteAllData(_context.LeadActivity, "LeadActivities");
                //totalRemoved += await DeleteAllData(_context.LeadContact, "LeadContacts");
                //totalRemoved += await DeleteAllData(_context.Lead, "Leads");
                //totalRemoved += await DeleteAllData(_context.Expense, "Expenses");
                //totalRemoved += await DeleteAllData(_context.Budget, "Budgets");
                //totalRemoved += await DeleteAllData(_context.Campaign, "Campaigns");
                //totalRemoved += await DeleteAllData(_context.SalesRepresentative, "SalesRepresentatives");
                //totalRemoved += await DeleteAllData(_context.SalesTeam, "SalesTeams");

                //// Commandes                        
                //totalRemoved += await DeleteAllData(_context.PurchaseOrder, "PurchaseOrders");
                //totalRemoved += await DeleteAllData(_context.SalesOrder, "SalesOrders");

                //// Produits                         
                //totalRemoved += await DeleteAllData(_context.Product, "Products");
                //totalRemoved += await DeleteAllData(_context.ProductGroup, "ProductGroups");
                //totalRemoved += await DeleteAllData(_context.UnitMeasure, "UnitMeasures");

                //// Fournisseurs
                //totalRemoved += await DeleteAllData(_context.VendorContact, "VendorContacts");
                //totalRemoved += await DeleteAllData(_context.Vendor, "Vendors");
                //totalRemoved += await DeleteAllData(_context.VendorGroup, "VendorGroups");
                //totalRemoved += await DeleteAllData(_context.VendorCategory, "VendorCategories");

                //// Clients
                //totalRemoved += await DeleteAllData(_context.CustomerContact, "CustomerContacts");
                //totalRemoved += await DeleteAllData(_context.Customer, "Customers");
                //totalRemoved += await DeleteAllData(_context.CustomerGroup, "CustomerGroups");
                //totalRemoved += await DeleteAllData(_context.CustomerCategory, "CustomerCategories");

                //// Utilisateurs démo
                //totalRemoved += await DeleteAllData(_context.Users, "DemoUsers");

                //// Taxes
                //totalRemoved += await DeleteAllData(_context.Tax, "Tax");

                await _context.Database.EnsureDeletedAsync();
                await _context.Database.EnsureCreatedAsync();


                RestoreSystem();
                // Valider la transaction
                //await transaction.CommitAsync();
                



                report.Success = true;
                report.TotalEntitiesRemoved = totalRemoved;
                report.Message = $"Nettoyage terminé avec succès. {totalRemoved} enregistrements supprimés.";
                _logger.LogInformation(report.Message);
            }
            catch (Exception ex)
            {
                report.Success = false;
                report.ErrorMessage = ex.Message;
                report.Exception = ex;
                _logger.LogError(ex, "Erreur lors du nettoyage de la base de données");
            }

            return report;
        }



        private async Task<int> DeleteAllData<T>(DbSet<T> dbSet, string entityName) where T : class
        {
            try
            {
                var count = await dbSet.CountAsync();
                if (count > 0)
                {
                    await dbSet.ExecuteDeleteAsync();
                    _logger.LogInformation($"Suppression de {count} enregistrements de {entityName}");
                    return count;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Erreur lors de la suppression des données de {entityName}");
            }
            return 0;
        }

        private async Task<int> DeleteAllData<T>(IQueryable<T> query, string entityName) where T : class
        {
            try
            {
                var count = await query.CountAsync();
                if (count > 0)
                {
                    await query.ExecuteDeleteAsync();
                    _logger.LogInformation($"Suppression de {count} enregistrements de {entityName}");
                    return count;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Erreur lors de la suppression des données de {entityName}");
            }
            return 0;
        }
    }

}
