using Application.Features.FileDocumentManager.Commands;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using System.Globalization;
using System.IO;
using System.Text;

namespace Infrastructure.Utils
{
    public static class MethodeFile
    {
        public static Object ReadCsvFile(CreateDocumentRequest request, string separator, string dateTimeformat)
        {
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

            var records = csv.GetRecords<testCsv>().ToList();
            foreach (var record in records)
            {
                Console.WriteLine($"FromDate: {record.FromDate}, ToDate: {record.ToDate}, ClientId: {record.ClientId},SubscriptionId:{record.SubscriptionId} ");

            }
            
            return records;
        }
    }
}
