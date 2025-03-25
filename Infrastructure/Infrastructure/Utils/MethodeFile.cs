using Application.Features.FileDocumentManager.Commands;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Infrastructure.Utils.objectDTO;
using System.Globalization;
using System.IO;
using System.Text;

namespace Infrastructure.Utils
{

    public class CsvProcessingResult
    {
        public string fileName { get; set; }
        public List<ResultImportMap> SuccessfulRecords { get; set; } = new List<ResultImportMap>();
        public List<CsvErrorRecord> ErrorRecords { get; set; } = new List<CsvErrorRecord>();

        public String GetMessageError()
        {
            string message = "Error on line : on file "+fileName+"/n";
            foreach (var error in ErrorRecords)
            {
                message += "line: " + error.LineNumber + ";";
                message += "data: " + error.LineNumber + "; /n";
            }
            return message;
        }
    }

    public class CsvProcessingCampaignResult
    {
        public string fileName { get; set; }
        public List<CampaignImportMap> SuccessfulRecords { get; set; } = new List<CampaignImportMap>();
        public List<CsvErrorRecord> ErrorRecords { get; set; } = new List<CsvErrorRecord>();

        public String GetMessageError()
        {
            string message = "Error on file " + fileName + "\n";
            foreach (var error in ErrorRecords)
            {
                message += "line: "+error.LineNumber+";";
                message += "data: "+error.LineNumber + "; \n";
            }
            return message;
        }
    }

    public class CsvErrorRecord
    {
        public int LineNumber { get; set; }
        public string RawData { get; set; }
        
    }

    public class MethodeFile
    {
        private ImportService _importService;

        public MethodeFile(ImportService importService)
        {
            _importService = importService;
        }


        public CsvProcessingResult ReadCsvFile(CreateDocumentRequest request, string separator, string dateTimeformat, List<CampaignImportMap> campaigns)
        {
            CsvProcessingResult csvProcessingResults = new CsvProcessingResult();
            csvProcessingResults.fileName = request.OriginalFileName;

            if (request == null || request.Data == null || request.Extension?.ToLower() != "csv")
            {
                Console.WriteLine("Invalid file or file format.");
                return null;
            }


            using var memoryStream = new MemoryStream(request.Data);
            using var reader = new StreamReader(memoryStream, Encoding.UTF8);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = separator,
                HasHeaderRecord = true,
                Mode = CsvMode.RFC4180,
                PrepareHeaderForMatch = args => args.Header.ToLower(),
            });
            

            //Date paresing
            if (!string.IsNullOrEmpty(dateTimeformat))
            {
                var conversionOption = new TypeConverterOptions { Formats = new[] { dateTimeformat } };
                    
                var dateOnlyFormat = new TypeConverterOptions { Formats = new[] { dateTimeformat.Substring(0,10) } };
                Console.WriteLine($"DateOnly format:{dateTimeformat.Substring(0,10)}");
                csv.Context.TypeConverterOptionsCache.GetOptions<DateTime>().Formats = conversionOption.Formats;

                csv.Context.TypeConverterOptionsCache.GetOptions<DateOnly>().Formats = dateOnlyFormat.Formats;
            }

            //var records = csv.GetRecords<testCsv>().ToList();
            List<testCsv> result = new List<testCsv>();

            // Lire l'en-tête pour obtenir les noms de colonnes
            csv.Read();
            csv.ReadHeader();

            // Compteur de ligne pour le suivi des erreurs
            int lineNumber = 1; // Commence à 1 car la première ligne est l'en-tête

            // Traitement de chaque enregistrement individuellement
            while (csv.Read())
            {
                try
                {
                    lineNumber++;

                    // Tenter de convertir la ligne en objet
                    var record = csv.GetRecord<ResultImportMap>();

                    // Validations supplémentaires si nécessaire
                    ValidateRecordResult(record, campaigns);

                    // Ajouter l'enregistrement aux succès
                    csvProcessingResults.SuccessfulRecords.Add(record);
                }
                catch (Exception ex)
                {
                    // Capturer l'erreur et stocker les détails
                    csvProcessingResults.ErrorRecords.Add(new CsvErrorRecord
                    {
                        LineNumber = lineNumber,
                        RawData = GetRawLineData(csv),
                    });

                    // Option : logger l'erreur
                    Console.WriteLine($"Erreur à la ligneeeeee {lineNumber}: {ex.Message}");
                }
            }


            return csvProcessingResults;
        }

        public CsvProcessingCampaignResult ReadCsvFileCampaigne(CreateDocumentRequest request, string separator)
        {
            CsvProcessingCampaignResult csvProcessingResults = new CsvProcessingCampaignResult();
            csvProcessingResults.fileName = request.OriginalFileName;


            if (request == null || request.Data == null || request.Extension?.ToLower() != "csv")
            {
                Console.WriteLine("Invalid file or file format.");
                return null;
            }


            using var memoryStream = new MemoryStream(request.Data);
            using var reader = new StreamReader(memoryStream, Encoding.UTF8);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = separator,
                HasHeaderRecord = true,
                Mode = CsvMode.RFC4180,
                PrepareHeaderForMatch = args => args.Header.ToLower(),
            });

            //var records = csv.GetRecords<testCsv>().ToList();
 

            // Lire l'en-tête pour obtenir les noms de colonnes
            csv.Read();
            csv.ReadHeader();

            // Compteur de ligne pour le suivi des erreurs
            int lineNumber = 1; // Commence à 1 car la première ligne est l'en-tête

            // Traitement de chaque enregistrement individuellement
            while (csv.Read())
            {
                try
                {
                    lineNumber++;

                    // Tenter de convertir la ligne en objet
                    var record = csv.GetRecord<CampaignImportMap>();

                    // Validations supplémentaires si nécessaire
                    ValidateRecordCamp(record);

                    // Ajouter l'enregistrement aux succès
                    csvProcessingResults.SuccessfulRecords.Add(record);
                }
                catch (Exception ex)
                {
                    // Capturer l'erreur et stocker les détails
                    csvProcessingResults.ErrorRecords.Add(new CsvErrorRecord
                    {
                        LineNumber = lineNumber,
                        RawData = GetRawLineData(csv),
                    });

                    // Option : logger l'erreur
                    Console.WriteLine($"Erreur à la ligneee {lineNumber}: {ex.Message}");
                }
            }


            return csvProcessingResults;
        }

        public (List<Campaign>,List<Budget>,List<Expense>) saveDataImport(List<CampaignImportMap> camps, List<ResultImportMap> results, DataContext context)
        {
            List<Campaign> campaigns = _importService.CreateCampaigns(camps, results).Result;
            context.Campaign.AddRange(campaigns);
            context.SaveChanges();

            List<Budget> budgets = _importService.CreateBudgets(results).Result;
            context.Budget.AddRange(budgets);
            context.SaveChanges();

            List<Expense> expenses = _importService.CreateExpenses(results).Result;
            context.Expense.AddRange(expenses);
            context.SaveChanges();

            return (campaigns, budgets, expenses);

        }

        // Méthode de validation supplémentaire (personnalisez selon vos besoins)
        private void ValidateRecordCamp(CampaignImportMap record)
        {
            // Exemples de validations
            if (record == null)
                throw new ArgumentNullException(nameof(record), "L'enregistrement ne peut pas être null");

            // Ajoutez vos propres règles de validation
            if (record.campaign_code=="" || record.campaign_code == null)
            {
                throw new ArgumentException(nameof(record.campaign_code), "L'enregistrement ne peut pas être null");
            }
            if (record.campaign_title == "" || record.campaign_title == null)
            {
                throw new ArgumentException(nameof(record.campaign_title), "L'enregistrement ne peut pas être null");
            }
        }

        private void ValidateRecordResult(ResultImportMap record, List<CampaignImportMap> camps)
        {
            // Exemples de validations
            if (record == null)
                throw new ArgumentNullException(nameof(record), "L'enregistrement ne peut pas être null");

            // Ajoutez vos propres règles de validation
            if (record.Campaign_number == null || !camps.Select(c => c.campaign_code).Contains(record.Campaign_number))
            {
                throw new ArgumentException(nameof(record.Campaign_number), "L'enregistrement ne peut pas être null");
            }
            if (!(record.Type == "Budget") && !(record.Type == "Expense"))
            {
                throw new ArgumentException(nameof(record.Type), " L'enregistrement ne peut pas être null ou different de Budget ou Expense");
            }
            if (record.Amount == null || record.Amount <= 0)
            {
                throw new ArgumentException(nameof(record.Amount), " L'enregistrement ne peut pas être null ou inferieur a 0");
            }
        }

        // Méthode pour obtenir les données brutes de la ligne en cas d'erreur
        private string GetRawLineData(CsvReader csv)
        {
            try
            {
                return string.Join(";", csv.HeaderRecord.Select((header, index) =>
                    $"{header}: {csv.GetField(index)}"));
            }
            catch
            {
                return "Impossible de récupérer les données brutes";
            }
        }
    }


}
