# 🚀 Free CRM - Open Source CRM Software  

![Free CRM](https://cdn.shopify.com/s/files/1/0097/8422/9945/files/free-crm-software.jpg?v=1739972475)  

## 📌 About Free CRM  

Free CRM is an **open-source Customer Relationship Management (CRM) software** designed to help businesses **manage campaigns, leads, budgets, expenses, and sales teams** efficiently.  

With Free CRM, businesses can streamline **operations and drive growth** by providing the right tools for **collaboration and teamwork**. Everyone works on the **same platform** with a **single source of truth**, eliminating scattered Excel files and outdated data silos.  

Ideal for **solo entrepreneurs, small businesses, startups, and enterprises** beginning their **digital transformation journey**.  


## 🎯 Key Features  

### 📊 **Dashboard Overview**  
Gain quick insights with **widgets and charts** for:  
- Total **Campaign Costs**  
- Total **Target Leads in Revenue**  
- Total **Budget & Expenses**  
- Total **Closed Won Leads**  
- Sales **Funnel Stages** (Prospecting → Qualification → Need Analysis → Proposal → Negotiation → Decision Making → Closed)  
- **Lead Closing by Sales Team** for performance tracking  
- **Campaign by Status** (Draft, Cancelled, Confirmed, On Progress, On Hold, Finished, Archived)  
- **Lead Activity Pyramid** (Email, Event, Other, Meeting, Social Media, Phone)  

### 🔥 **Pipeline Modules**  

#### 📢 **Campaign Management**  
- Auto-generated **Campaign Number**  
- Set **Start & Finish Dates**  
- **Target Revenue Amount**  
- **Campaign Status** (Draft, Confirmed, etc.)  
- **Sales Team Assignment**  
- **Budget & Expense Breakdown** in a single page  

#### 💰 **Budget Management**  
- Auto-generated **Budget Number**  
- **Budget Date & Amount**  
- **Related Campaign Lookup**  
- **Status & Description**  

#### 🏷️ **Expense Management**  
- Auto-generated **Expense Number**  
- **Expense Date & Amount**  
- **Related Campaign Lookup**  
- **Status & Description**  

#### 🎯 **Lead Management**  
- Auto-generated **Lead Number**  
- **Lead Description & Company Name**  
- **Address & Contact Info** (Phone, Fax, Email, Website)  
- **Social Media Integration** (WhatsApp, LinkedIn, Facebook, Instagram, Twitter)  
- **BANT Score** (Budget, Authority, Need, Timeline)  
- **Important Dates** (Prospecting Date, Estimated Closing Date, Actual Closing Date)  
- **Goals & Status** (Targeted Amount, Closed Amount, Pipeline Stage, Closing Status)  
- **Sales Team Assignment**  

#### 📇 **Lead Contact & Activity Management**  
- Store **multiple contacts per lead**  
- Record lead activities: **Email, Phone Call, Meeting, Event, Social Media, Others**  

### 🤝 **Sales Team & Representatives**  
- Manage **Sales Teams & Members**  
- Assign **Leads & Campaigns**  

### 🛒 **Sales Order & Purchase Order Modules**  
- Manage **Sales Orders & Purchases** with tracking & reporting  

🎯 **Challenge Yourself!**  
Experience the blazing speed and efficiency of **.NET 9**, the latest breakthrough in performance from Microsoft. Explore our **live online demo** today and see firsthand how Free CRM can revolutionize your customer relationship management operations.  


# Monolithic Clean Architecture  

Free CRM is built using a **Monolithic Clean Architecture** approach, ensuring a structured and simplified development process. By keeping all components within a single codebase, dependency management is streamlined, eliminating the risk of a **dependency nightmare**. This approach consolidates all dependencies in one place, ensuring compatibility and coherence across the entire system.  

Additionally, it simplifies **deployment**, as all code resides in a single repository with a well-optimized pipeline, reducing complexity. The **cohesive project structure** provides a clear and consistent source code pattern, making it easier for developers to understand and maintain the system. With the combination of Clean Architecture, CQRS, and MediatR, Free CRM delivers a **scalable, maintainable, and enterprise-ready solution**.

# Technical Features
- **ASP.NET Core 9.0 Headless API** (Back End)
  - Clean Architecture
  - CQRS with MediatR
  - Repository Pattern
  - Entity Framework Core (EF Core) for data access
  - AutoMapper for object mapping
  - FluentValidation for input validation
  - Serilog for logging
  - Support for file uploads and downloads (images/documents)
  - Secure authentication and authorization with ASP.NET Identity + JWT
- **ASP.NET Core Razor Pages with a Simple & Modern UI** (Front End)  
  - **Effortless** dynamic interactivity using Vue.js **without any build system**  
  - **Ready-to-use** industry-leading Syncfusion UI components (free community edition)  
  - **Lightweight and straightforward** API communication with Axios  
  - **Easy-to-customize** responsive UI powered by the AdminLTE template  



# Run The Project: Visual Studio  

Getting started is **easy**! Thanks to **Monolithic Clean Architecture**, everything is structured and streamlined. Plus, even though this project uses a **modern JavaScript framework like Vue.js**, it **does not require a build system**—just use Visual Studio to run and build effortlessly.  

1. Open the project using Visual Studio.  
2. Update the connection string in `appsettings.json` to match your SQL Server database.  
3. Clean and build the solution:  
   - Right-click the solution > Clean  
   - Right-click the solution > Build  
4. Run the project:  
   - Click the green "play" button in the Visual Studio toolbar.  

> **Note**: The database will be created automatically if it does not exist.  




# Run The Project: IIS Web Server  

Deployment is **easy**! Thanks to **Monolithic Clean Architecture**, both the front end and back end are in a single deployable unit, making the process straightforward.  

For deployment to IIS:  

1. **Publish the project**:  
   - Right-click the project > Publish.  
   - Choose a folder to output the files.  

2. **Deploy to IIS**:  
   - Copy the published files to your IIS directory.  
   - Configure IIS to point to the folder and ensure database connectivity.  

> For detailed instructions, refer to [Microsoft's official IIS deployment documentation](https://learn.microsoft.com/en-us/aspnet/core/tutorials/publish-to-iis).  



# Live Demo Link
- **URL**: [https://free-crm.csharpasp.net/](https://free-crm.csharpasp.net/)
- ✅ **Username**: admin@root.com  
- ✅ **Password**: 123456  



# Acknowledgments

This project uses the following open-source and community resources:

- [Syncfusion Community Edition](https://www.syncfusion.com/products/communitylicense) - For advanced UI components.  
- [AdminLTE](https://github.com/ColorlibHQ/AdminLTE) - Licensed under the MIT License.  

We thank these projects for their contributions to the developer community.


# License

This work is licensed under a [Creative Commons Attribution 4.0 International License (CC BY 4.0)](http://creativecommons.org/licenses/by/4.0/).  
To view a copy of this license, visit [http://creativecommons.org/licenses/by/4.0/](http://creativecommons.org/licenses/by/4.0/).

Users are required to retain the footer link in all instances of this software as part of the attribution requirement under CC BY 4.0.



# Starred  
If you find this project useful, please consider supporting us by giving a star on GitHub! ⭐  
Your support keeps us motivated and helps us continue developing and improving this project to deliver even greater value to the community.   


# 🌱 Help Us Grow!  
Please help us grow by sharing it with your friends, family, and colleagues!  
Every share helps us reach more people, grow the community, and continue improving this open-source project. ❤️  
 


# One Last Kiss ❤️  

Thanks for stopping by and reading this far! This project is supported by **INDOTALENT**

🌐 Feel free to visit: [https://store.indotalent.com](https://store.indotalent.com)  

[![store-indotalent](https://cdn.shopify.com/s/files/1/0097/8422/9945/files/store-indotalent-hero.png?v=1737235553)](https://store.indotalent.com)
### ✅ **How does Mini CRM help SMBs manage operations, drive growth, and streamline payroll?**
[![powerfull-mini-crm](https://cdn.shopify.com/s/files/1/0097/8422/9945/files/powerfull-mini-crm-for-smb.png?v=1737992595)](https://store.indotalent.com)
[![katenjo-crm-saas](https://store.indotalent.com/cdn/shop/files/hero1_f05d44f6-1298-4d0c-a46d-05395a7731d1_1024x1024@2x.png?v=1737932377)](https://store.indotalent.com/collections/featured-product/products/katenjo-crm-full-stack-edition-saas-multi-tenant)
[![customer relationship management software](https://store.indotalent.com/cdn/shop/files/hero-crm-platinum-customer-relationship-management3_b5af66b6-3af1-41a0-a90e-e39c6d05ac67_1024x1024@2x.jpg?v=1739085851)](https://store.indotalent.com/)
[![customer relationship management software Blazor](https://store.indotalent.com/cdn/shop/files/hero01_1024x1024@2x.png?v=1758478421)](https://store.indotalent.com/)




