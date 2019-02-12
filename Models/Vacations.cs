using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace aspnetcoredemo.Models
{
	public partial class Vacations
	{
		[Key]
		public int Id { get; set; }
		public int EmployeeId { get; set; }
		public DateTime? From { get; set; }
		public DateTime? To { get; set; }

		public Employees Employee { get; set; }
	}
}
