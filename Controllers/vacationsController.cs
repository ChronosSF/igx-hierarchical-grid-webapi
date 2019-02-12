using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using aspnetcoredemo.Models;

namespace aspnetcoredemo.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class vacationsController : ControllerBase
	{
		private readonly EmployeesContext repository;

		public vacationsController()
		{
			this.repository = new EmployeesContext();
		}

		public IEnumerable<Vacations> Get(int EmployeeId)
		{
			return this.repository.Vacations.Where(v => v.EmployeeId == EmployeeId);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Employees>> GetVacation(long id)
		{
			var todoItem = await repository.Employees.FindAsync(id);

			if (todoItem == null)
			{
				return NotFound();
			}

			return todoItem;
		}

		// PUT: api/Todo/5
		[HttpPut]
		public async Task<IActionResult> PutVacation([FromQuery] int[] id, [FromBody] Vacations[] items)
		{
			foreach (Vacations item in items)
			{
				this.repository.Entry(item).State = EntityState.Modified;
			}

			await this.repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPost]
		public async Task<ActionResult<Vacations>> PostVacation(Vacations item)
		{
			this.repository.Add(item);

			await this.repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetVacation), new { id = item.Id }, item);
		}

		[HttpDelete]
		public async Task<IActionResult> DeleteVacation([FromQuery] int[] id)
		{
			List<Vacations> toRemove = new List<Vacations>();
			foreach (int i in id)
			{
				Vacations e = await this.repository.Vacations.FindAsync(i);

				if (e == null)
				{
					return NotFound();
				}
				toRemove.Add(e);
			}
			this.repository.RemoveRange(toRemove);
			await this.repository.SaveChangesAsync();

			return NoContent();
		}
	}
}
