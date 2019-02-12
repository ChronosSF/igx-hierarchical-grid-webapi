using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace aspnetcoredemo.Models
{
	public partial class Employees
	{
		public Employees()
		{
			Vacations = new HashSet<Vacations>();
		}

		[Key]
		public int Id { get; set; }
		public string Name { get; set; }
		public byte? Age { get; set; }

		public ICollection<Vacations> Vacations { get; set; }
	}
}
