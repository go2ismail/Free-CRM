namespace Infrastructure.CSVManager
{
    public class CSVSettings
    {
        public string Separator { get; set; } = ",";  
        public string FileEncoding { get; set; } = "UTF-8";
        public string DefaultPath { get; set; } = "";
    }
}