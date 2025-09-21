using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.DataAccessManager.EFCore.Repositories;
using Infrastructure.Utils.objectDTO;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Utils
{
    public class ImportService
    {
        private readonly ICommandRepository<Campaign> _campaignRepository;
        private readonly ICommandRepository<SalesTeam> _salesTeamRepository;
        private readonly NumberSequenceService _numberSequenceService;
        private readonly ICommandRepository<Budget> _budgetRepository;
        private readonly ICommandRepository<Expense> _expenseRepository;

        public ImportService(
            ICommandRepository<Campaign> campaignRepository,
            ICommandRepository<Budget> budgetRepository,
            ICommandRepository<Expense> expenseRepository,
            ICommandRepository<SalesTeam> salesTeamRepository,
            NumberSequenceService numberSequenceService
        )
        {
            _campaignRepository = campaignRepository;
            _salesTeamRepository = salesTeamRepository;
            _numberSequenceService = numberSequenceService;
            _budgetRepository = budgetRepository;
            _expenseRepository = expenseRepository;
        }

        public async Task<List<Campaign>> CreateCampaigns(List<CampaignImportMap> camps, List<ResultImportMap> resImports)
        {
            List<Campaign> capsVal = new List<Campaign>();
            foreach (var camp in camps)
            {
                var bdgExpCamp = resImports.Where(r => r.Campaign_number == camp.campaign_code);
                var dateStart = bdgExpCamp.Any() ? bdgExpCamp.Min(r => r.Date) : DateOnly.MinValue.AddMonths(-2);
                var random = new Random();
                var dateFinish = bdgExpCamp.Any() ? bdgExpCamp.Min(r => r.Date) : DateOnly.MinValue.AddMonths(5);

                var salesTeamIds = await _salesTeamRepository.GetQuery()
                    .Select(st => st.Id)
                    .ToListAsync();

                var status = 2;
                string number = camp.campaign_code;
                var campaign = new Campaign
                {
                    Number = number,
                    Title = camp.campaign_title,
                    Description = $"Description for campaign starting {dateStart:MMMM yyyy}",
                    TargetRevenueAmount = 10000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                    CampaignDateStart = dateStart.ToDateTime(TimeOnly.MinValue),
                    CampaignDateFinish = dateFinish.ToDateTime(TimeOnly.MinValue),
                    Status = (Domain.Enums.CampaignStatus?)2,
                    SalesTeamId = GetRandomValue(salesTeamIds, random)
                };

                //await _campaignRepository.CreateAsync(campaign);
                capsVal.Add(campaign);
            }
            return capsVal;
        }
        private static string GetRandomValue(List<string> list, Random random)
        {
            return list[random.Next(list.Count)];
        }

        public async Task<List<Budget>> CreateBudgets(List<ResultImportMap> rests)
        {
            List<Budget> bdsVal = new List<Budget>();
            List<ResultImportMap> bdgts = rests.Where(r => r.Type == "Budget").ToList();
            foreach (var b in bdgts)
            {

                var confirmedCampaigns = (await _campaignRepository.GetQuery()
                .Where(c => c.Number == b.Campaign_number)
                .Select(c => c.Id)
                .FirstAsync());


                var budget = new Budget
                {
                    Number = _numberSequenceService.GenerateNumber(nameof(Budget), "", "BUD"),
                    Title = b.Title,
                    Description = $"Description for budget on {b.Date:MMMM yyyy}",
                    BudgetDate = b.Date.ToDateTime(TimeOnly.MinValue),
                    Status = (Domain.Enums.BudgetStatus?)2,
                    Amount = b.Amount,
                    CampaignId = confirmedCampaigns
                };

                //await _budgetRepository.CreateAsync(budget);
                bdsVal.Add(budget);
            }
            return bdsVal;
        }

        public async Task<List<Expense>> CreateExpenses(List<ResultImportMap> rests)
        {
            List<Expense> expsVal = new List<Expense>();
            List<ResultImportMap> expts = rests.Where(r => r.Type == "Expense").ToList();
            foreach (var e in expts)
            {

                var confirmedCampaigns = (await _campaignRepository.GetQuery()
                .Where(c => c.Number ==e.Campaign_number)
                .Select(c => c.Id)
                .FirstAsync());

                var expense = new Expense
                {
                    Number = _numberSequenceService.GenerateNumber(nameof(Expense), "", "BUD"),
                    Title = e.Title,
                    Description = $"Description for budget on {e.Date:MMMM yyyy}",
                    ExpenseDate = e.Date.ToDateTime(TimeOnly.MinValue),
                    Status = (Domain.Enums.ExpenseStatus?)2,
                    Amount = e.Amount,
                    CampaignId = confirmedCampaigns
                };

                //await _expenseRepository.CreateAsync(expense);
                expsVal.Add(expense);
            }
            return expsVal;
        }

    }
}
