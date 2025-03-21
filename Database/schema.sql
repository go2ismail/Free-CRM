CREATE TABLE CustomerCategory(
                                 IdCustomerCategory VARCHAR(50) ,
                                 Name VARCHAR(255)  NOT NULL,
                                 Description VARCHAR(max),
   PRIMARY KEY(IdCustomerCategory)
);

CREATE TABLE CustomerGroup(
                              IdCustomerGroup VARCHAR(50) ,
                              Name VARCHAR(255)  NOT NULL,
                              Description VARCHAR(max),
   PRIMARY KEY(IdCustomerGroup)
);

CREATE TABLE VendorCategory(
                               IdVendorCategory VARCHAR(50) ,
                               Name VARCHAR(255)  NOT NULL,
                               Description VARCHAR(max),
   PRIMARY KEY(IdVendorCategory)
);

CREATE TABLE VendorGroup(
                            IdVendorGroup VARCHAR(50) ,
                            Name VARCHAR(255)  NOT NULL,
                            Description VARCHAR(max),
   PRIMARY KEY(IdVendorGroup)
);

CREATE TABLE UnitMeasure(
                            IdUnit VARCHAR(50) ,
                            Name VARCHAR(255)  NOT NULL,
                            Description VARCHAR(max),
   PRIMARY KEY(IdUnit)
);

CREATE TABLE ProductGroup(
                             IdProductGroup VARCHAR(50) ,
                             Name VARCHAR(255)  NOT NULL,
                             Description VARCHAR(max),
   PRIMARY KEY(IdProductGroup)
);

CREATE TABLE Product(
                        IdProduct VARCHAR(50) ,
                        Name VARCHAR(255)  NOT NULL,
                        Number VARCHAR(255) ,
                        Description VARCHAR(max),
   UnitPrice FLOAT,
   Physical BIT,
   IdUnit VARCHAR(50)  NOT NULL,
   IdProductGroup VARCHAR(50) ,
   PRIMARY KEY(IdProduct),
   FOREIGN KEY(IdUnit) REFERENCES UnitMeasure(IdUnit),
   FOREIGN KEY(IdProductGroup) REFERENCES ProductGroup(IdProductGroup)
);

CREATE TABLE Company(
                        IdCompany VARCHAR(50) ,
                        Name VARCHAR(255)  NOT NULL,
                        Description VARCHAR(max),
   Currency VARCHAR(255) ,
   Street VARCHAR(255) ,
   City VARCHAR(255) ,
   State VARCHAR(255) ,
   ZipCode VARCHAR(255) ,
   Country VARCHAR(255) ,
   PhoneNumber VARCHAR(255) ,
   FaxNumber VARCHAR(255) ,
   EmailAddress VARCHAR(255) ,
   Website VARCHAR(255) ,
   PRIMARY KEY(IdCompany)
);

CREATE TABLE Tax(
                    IdTax VARCHAR(50) ,
                    Name VARCHAR(255)  NOT NULL,
                    Percentage FLOAT,
                    Description VARCHAR(max),
   PRIMARY KEY(IdTax)
);

CREATE TABLE NumberSequence(
                               IdNumberSequence VARCHAR(50) ,
                               EntityName VARCHAR(255)  NOT NULL,
                               Prefix VARCHAR(50) ,
                               Suffix VARCHAR(50) ,
                               LastUsedCount INT,
                               PRIMARY KEY(IdNumberSequence)
);

CREATE TABLE ToDo(
                     IdToDo VARCHAR(50) ,
                     Name VARCHAR(255)  NOT NULL,
                     Description VARCHAR(max),
   PRIMARY KEY(IdToDo)
);

CREATE TABLE Users(
                      IdUsers VARCHAR(50) ,
                      FirstName VARCHAR(255) ,
                      LastName VARCHAR(255) ,
                      CompanyName VARCHAR(255) ,
                      ProfilePictureName VARCHAR(255) ,
                      IsBlocked BIT NOT NULL,
                      UserName VARCHAR(255)  NOT NULL,
                      Email VARCHAR(255) ,
                      EmailConfirmed BIT,
                      PasswordHash VARCHAR(max),
   PRIMARY KEY(IdUsers),
   UNIQUE(Email)
);

CREATE TABLE Profiles(
                         IdProfiles VARCHAR(50) ,
                         Name VARCHAR(50)  NOT NULL,
                         PRIMARY KEY(IdProfiles)
);

CREATE TABLE FileDocument(
                             IdDocument VARCHAR(50) ,
                             Name VARCHAR(255)  NOT NULL,
                             Description VARCHAR(max),
   OriginalName VARCHAR(255) ,
   GeneratedName VARCHAR(255) ,
   Extension VARCHAR(50) ,
   FileSize BIGINT,
   PRIMARY KEY(IdDocument)
);

CREATE TABLE FileImage(
                          IdImage VARCHAR(50) ,
                          Name VARCHAR(255)  NOT NULL,
                          OriginalName VARCHAR(255) ,
                          GeneratedName VARCHAR(255) ,
                          Extension VARCHAR(50) ,
                          FileSize BIGINT,
                          Description VARCHAR(max),
   PRIMARY KEY(IdImage)
);

CREATE TABLE Token(
                      IdToken VARCHAR(50) ,
                      RefreshToken VARCHAR(255) ,
                      ExpiryDate DATETIMEOFFSET NOT NULL,
                      IdUsers VARCHAR(50)  NOT NULL,
                      PRIMARY KEY(IdToken),
                      FOREIGN KEY(IdUsers) REFERENCES Users(IdUsers)
);

CREATE TABLE SalesTeam(
                          IdSalesTeam VARCHAR(50) ,
                          Name VARCHAR(255)  NOT NULL,
                          Description VARCHAR(max),
   PRIMARY KEY(IdSalesTeam)
);

CREATE TABLE SalesRepresentative(
                                    IdSalesRepresentative VARCHAR(50) ,
                                    Number VARCHAR(255) ,
                                    JobTitle VARCHAR(255) ,
                                    EmployeeNumber VARCHAR(255) ,
                                    PhoneNumber VARCHAR(255) ,
                                    EmailAddress VARCHAR(255) ,
                                    Name VARCHAR(255)  NOT NULL,
                                    Description VARCHAR(max),
   IdSalesTeam VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdSalesRepresentative),
   FOREIGN KEY(IdSalesTeam) REFERENCES SalesTeam(IdSalesTeam)
);

CREATE TABLE Campaign(
                         IdCampaign VARCHAR(50) ,
                         Number VARCHAR(255) ,
                         Title VARCHAR(255)  NOT NULL,
                         Description VARCHAR(255) ,
                         TargetRevenueAmount FLOAT,
                         CampaignDateStart DATETIMEOFFSET,
                         CampaignDateFinish DATETIMEOFFSET,
                         Status INT,
                         IdSalesTeam VARCHAR(50) ,
                         PRIMARY KEY(IdCampaign),
                         FOREIGN KEY(IdSalesTeam) REFERENCES SalesTeam(IdSalesTeam)
);

CREATE TABLE Budget(
                       IdBudget VARCHAR(50) ,
                       Number VARCHAR(255) ,
                       Title VARCHAR(255)  NOT NULL,
                       Description VARCHAR(255) ,
                       Amount FLOAT,
                       BudgetDate DATETIMEOFFSET,
                       Status INT,
                       IdCampaign VARCHAR(50) ,
                       PRIMARY KEY(IdBudget),
                       FOREIGN KEY(IdCampaign) REFERENCES Campaign(IdCampaign)
);

CREATE TABLE Expense(
                        IdExpense VARCHAR(50) ,
                        Number VARCHAR(255) ,
                        Title VARCHAR(255)  NOT NULL,
                        Description VARCHAR(255) ,
                        Amount FLOAT,
                        ExpenseDate DATETIMEOFFSET,
                        Status INT,
                        IdCampaign VARCHAR(50) ,
                        PRIMARY KEY(IdExpense),
                        FOREIGN KEY(IdCampaign) REFERENCES Campaign(IdCampaign)
);

CREATE TABLE Leads(
                      IdLead VARCHAR(50) ,
                      Number VARCHAR(255) ,
                      Title VARCHAR(255) ,
                      Description VARCHAR(max),
   CompanyName VARCHAR(255) ,
   CompanyDescription VARCHAR(255) ,
   CompanyAddressStreet VARCHAR(255) ,
   CompanyAddressCity VARCHAR(255) ,
   CompanyAddressState VARCHAR(255) ,
   CompanyAddressZipCode VARCHAR(255) ,
   CompanyAddressCountry VARCHAR(255) ,
   CompanyPhoneNumber VARCHAR(255) ,
   CompanyFaxNumber VARCHAR(255) ,
   CompanyEmail VARCHAR(255) ,
   CompanyWhatsApp VARCHAR(255) ,
   CompanyLinkedIn VARCHAR(255) ,
   CompanyFacebook VARCHAR(255) ,
   CompanyInstagram VARCHAR(50) ,
   CompanyTwitter VARCHAR(50) ,
   DateProspecting DATETIMEOFFSET,
   DateClosingEstimation DATETIMEOFFSET,
   DateClosingActual DATETIMEOFFSET,
   AmountTargeted FLOAT,
   AmountClosed FLOAT,
   BudgetScore FLOAT,
   AuthorityScore FLOAT,
   NeedScore FLOAT,
   TimelineScore FLOAT,
   PipelineStage VARCHAR(max),
   ClosingStatus INT,
   ClosingNote VARCHAR(max),
   IdCampaign VARCHAR(50) ,
   IdSalesTeam VARCHAR(50) ,
   PRIMARY KEY(IdLead),
   FOREIGN KEY(IdCampaign) REFERENCES Campaign(IdCampaign),
   FOREIGN KEY(IdSalesTeam) REFERENCES SalesTeam(IdSalesTeam)
);

CREATE TABLE LeadsActivity(
                              IdLeadsActivity VARCHAR(50) ,
                              Number VARCHAR(255) ,
                              Summary VARCHAR(255) ,
                              Description VARCHAR(max),
   FromDate DATETIME2,
   ToDate DATETIME2,
   Type VARCHAR(max),
   AttachmentName VARCHAR(255) ,
   IdLead VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdLeadsActivity),
   FOREIGN KEY(IdLead) REFERENCES Leads(IdLead)
);

CREATE TABLE LeadsContact(
                             IdLeadsContact VARCHAR(50) ,
                             Number VARCHAR(255) ,
                             FullName VARCHAR(255) ,
                             Description VARCHAR(max),
   AddressStreet VARCHAR(255) ,
   AddressCity VARCHAR(255) ,
   AddressState VARCHAR(255) ,
   AddressZipCode VARCHAR(255) ,
   AddressCountry VARCHAR(255) ,
   PhoneNumber VARCHAR(255) ,
   FaxNumber VARCHAR(255) ,
   MobileNumber VARCHAR(255) ,
   Email VARCHAR(255) ,
   Website VARCHAR(255) ,
   WhatsApp VARCHAR(255) ,
   LinkedIn VARCHAR(255) ,
   Facebook VARCHAR(255) ,
   Twitter VARCHAR(255) ,
   Instagram VARCHAR(255) ,
   AvatarName VARCHAR(255) ,
   IdLead VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdLeadsContact),
   FOREIGN KEY(IdLead) REFERENCES Leads(IdLead)
);

CREATE TABLE Customer(
                         IdCustomer VARCHAR(50) ,
                         Name VARCHAR(255)  NOT NULL,
                         Description VARCHAR(max),
   Number VARCHAR(255) ,
   Street VARCHAR(255) ,
   FaxNumber VARCHAR(255) ,
   EmailAddress VARCHAR(255) ,
   Website VARCHAR(255) ,
   WhatsApp VARCHAR(255) ,
   LinkedIn VARCHAR(255) ,
   Facebook VARCHAR(255) ,
   Instagram VARCHAR(255) ,
   TwitterX VARCHAR(255) ,
   TikTok VARCHAR(255) ,
   IsDeleted BIT NOT NULL,
   City VARCHAR(255) ,
   State VARCHAR(255) ,
   ZipCode VARCHAR(255) ,
   Country VARCHAR(255) ,
   PhoneNumber VARCHAR(255) ,
   IdCustomerGroup VARCHAR(50) ,
   IdCustomerCategory VARCHAR(50) ,
   PRIMARY KEY(IdCustomer),
   FOREIGN KEY(IdCustomerGroup) REFERENCES CustomerGroup(IdCustomerGroup),
   FOREIGN KEY(IdCustomerCategory) REFERENCES CustomerCategory(IdCustomerCategory)
);

CREATE TABLE CustomerContact(
                                IdCustomerContact VARCHAR(50) ,
                                Name VARCHAR(255)  NOT NULL,
                                Number VARCHAR(255) ,
                                JobTitle VARCHAR(255) ,
                                PhoneNumber VARCHAR(255) ,
                                EmailAddress VARCHAR(255) ,
                                Description VARCHAR(max),
   IdCustomer VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdCustomerContact),
   FOREIGN KEY(IdCustomer) REFERENCES Customer(IdCustomer)
);

CREATE TABLE Vendor(
                       IdVendor VARCHAR(50) ,
                       Name VARCHAR(255)  NOT NULL,
                       Description VARCHAR(max),
   Number VARCHAR(255) ,
   Street VARCHAR(255) ,
   FaxNumber VARCHAR(255) ,
   EmailAddress VARCHAR(255) ,
   Website VARCHAR(255) ,
   WhatsApp VARCHAR(255) ,
   LinkedIn VARCHAR(255) ,
   Facebook VARCHAR(255) ,
   Instagram VARCHAR(255) ,
   TwitterX VARCHAR(255) ,
   TikTok VARCHAR(255) ,
   IsDeleted BIT NOT NULL,
   City VARCHAR(255) ,
   State VARCHAR(255) ,
   ZipCode VARCHAR(255) ,
   Country VARCHAR(255) ,
   PhoneNumber VARCHAR(255) ,
   IdVendorGroup VARCHAR(50) ,
   IdVendorCategory VARCHAR(50) ,
   PRIMARY KEY(IdVendor),
   FOREIGN KEY(IdVendorGroup) REFERENCES VendorGroup(IdVendorGroup),
   FOREIGN KEY(IdVendorCategory) REFERENCES VendorCategory(IdVendorCategory)
);

CREATE TABLE VendorContact(
                              IdVendorContact VARCHAR(50) ,
                              Name VARCHAR(255)  NOT NULL,
                              Number VARCHAR(255) ,
                              JobTitle VARCHAR(255) ,
                              PhoneNumber VARCHAR(255) ,
                              EmailAddress VARCHAR(255) ,
                              Description VARCHAR(max),
   IdVendor VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdVendorContact),
   FOREIGN KEY(IdVendor) REFERENCES Vendor(IdVendor)
);

CREATE TABLE ToDoItem(
                         IdToDoItem VARCHAR(50) ,
                         Name VARCHAR(255)  NOT NULL,
                         Description VARCHAR(max),
   IdToDo VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdToDoItem),
   FOREIGN KEY(IdToDo) REFERENCES ToDo(IdToDo)
);

CREATE TABLE SalesOrder(
                           IdSalesOrder VARCHAR(50) ,
                           Number VARCHAR(255) ,
                           OrderDate DATETIME2,
                           OrderStatus INT,
                           Description VARCHAR(max),
   BeforeTaxAmount FLOAT,
   TaxAmount FLOAT,
   AfterTaxAmount FLOAT,
   IdTax VARCHAR(50) ,
   IdCustomer VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdSalesOrder),
   FOREIGN KEY(IdTax) REFERENCES Tax(IdTax),
   FOREIGN KEY(IdCustomer) REFERENCES Customer(IdCustomer)
);

CREATE TABLE SalesOrderItem(
                               IdSalesOrderItem VARCHAR(50) ,
                               Summary VARCHAR(max),
   UnitPrice FLOAT,
   Quantity FLOAT,
   Total FLOAT,
   IdProduct VARCHAR(50)  NOT NULL,
   IdSalesOrder VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdSalesOrderItem),
   FOREIGN KEY(IdProduct) REFERENCES Product(IdProduct),
   FOREIGN KEY(IdSalesOrder) REFERENCES SalesOrder(IdSalesOrder)
);

CREATE TABLE PurchaseOrder(
                              IdPurchaseOrder VARCHAR(50) ,
                              Number VARCHAR(255) ,
                              OrderDate DATETIME2,
                              OrderStatus INT,
                              Description VARCHAR(max),
   BeforeTaxAmount FLOAT,
   TaxAmount FLOAT,
   AfterTaxAmount FLOAT,
   IdTax VARCHAR(50) ,
   IdVendor VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdPurchaseOrder),
   FOREIGN KEY(IdTax) REFERENCES Tax(IdTax),
   FOREIGN KEY(IdVendor) REFERENCES Vendor(IdVendor)
);

CREATE TABLE PurchaseOrderItem(
                                  IdPurchaseOrderItem VARCHAR(50) ,
                                  Summary VARCHAR(max),
   UnitPrice FLOAT,
   Quantity FLOAT,
   Total FLOAT,
   IdProduct VARCHAR(50)  NOT NULL,
   IdPurchaseOrder VARCHAR(50)  NOT NULL,
   PRIMARY KEY(IdPurchaseOrderItem),
   FOREIGN KEY(IdProduct) REFERENCES Product(IdProduct),
   FOREIGN KEY(IdPurchaseOrder) REFERENCES PurchaseOrder(IdPurchaseOrder)
);

CREATE TABLE UserProfil(
                           IdUsers VARCHAR(50) ,
                           IdProfiles VARCHAR(50) ,
                           PRIMARY KEY(IdUsers, IdProfiles),
                           FOREIGN KEY(IdUsers) REFERENCES Users(IdUsers),
                           FOREIGN KEY(IdProfiles) REFERENCES Profiles(IdProfiles)
);
