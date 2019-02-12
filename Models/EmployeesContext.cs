using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace aspnetcoredemo.Models
{
	public partial class EmployeesContext : DbContext
	{
		public EmployeesContext()
		{
		}

		public EmployeesContext(DbContextOptions<EmployeesContext> options)
			: base(options)
		{
		}

		public virtual DbSet<Employees> Employees { get; set; }
		public virtual DbSet<Vacations> Vacations { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			if (!optionsBuilder.IsConfigured)
			{
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
				optionsBuilder.UseSqlServer("Server=DEV-SSTOYCHEV\\SQLEXPRESS;Database=Employees;Trusted_Connection=True;");
			}
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Employees>(entity =>
			{
				entity.Property(e => e.Id).HasColumnName("ID");

				entity.Property(e => e.Name)
					.HasMaxLength(50)
					.IsUnicode(false);
			});

			modelBuilder.Entity<Vacations>(entity =>
			{
				entity.Property(e => e.Id).HasColumnName("ID");

				entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

				entity.Property(e => e.From).HasColumnType("datetime");

				entity.Property(e => e.To).HasColumnType("datetime");

				entity.HasOne(d => d.Employee)
					.WithMany(p => p.Vacations)
					.HasForeignKey(d => d.EmployeeId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("FK_Vacations_Employees");
			});
		}
	}
}
