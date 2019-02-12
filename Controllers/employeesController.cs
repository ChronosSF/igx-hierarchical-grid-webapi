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
	public class employeesController : ControllerBase
	{
		private readonly EmployeesContext repository;

		public employeesController()
		{
			this.repository = new EmployeesContext();
		}

		public IEnumerable<Employees> Get()
		{
			return this.repository.Employees;
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Employees>> GetEmployee(long id)
		{
			var todoItem = await repository.Employees.FindAsync(id);

			if (todoItem == null)
			{
				return NotFound();
			}

			return todoItem;
		}

		[HttpPut]
		public async Task<IActionResult> PutEmployee([FromQuery] int[] id, [FromBody] Employees[] items)
		{
			foreach (Employees item in items)
			{
				this.repository.Entry(item).State = EntityState.Modified;
			}

			await this.repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPost]
		public async Task<ActionResult<Employees>> PostEmployee(Employees item)
		{
			this.repository.Add(item);

			await this.repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetEmployee), new { id = item.Id }, item);
		}

		[HttpDelete]
		public async Task<IActionResult> DeleteEmployee([FromQuery] int[] id)
		{
			List<Employees> toRemove = new List<Employees>();
			foreach (int i in id)
			{
				Employees e = await this.repository.Employees.FindAsync(i);

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
