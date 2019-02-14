# IgxHierarchicalGrid with ASP.NET Core WebAPI CRUD

The app demonstrates how to enable full CRUD for Ignite UI for Angular IgxHierarchicalGrid bound to a remote ASP.NET Core WebAPI service.

## Run steps

To restore the packages required, please, run:

```
dotnet restore
npm install
```

To run first you need to build the client-side Angular app:

```
ng build
```

It outputs the produced files into the wwwroot dir. To serve:

```
dotnet run
```

You can find the sample data base file the EntityFramework model was scaffolded from in the App_Data folder. You need to add it to an MS SQL Server instance to use it as a back end. The connection settings are hardcoded in the `EmployeesContext.cs` file.
