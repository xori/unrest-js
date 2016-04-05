using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace linq.Controllers {
    public class ValuesController : ApiController {
        private static Dictionary<int, Values> db = new Dictionary<int, Values>() {
            { 1, new Values(1) }, { 2, new Values(2) }, { 3, new Values(3) }
        };
        Notifier<Values> notify = new Notifier<Values>("Values");

        // GET api/values
        public IHttpActionResult Get() {
            return Ok(db.Values);
        }

        // GET api/values/5
        public IHttpActionResult Get(int id) {
            return Ok(db[id]);
        }

        [Route("api/simple/{id}")]
        public IHttpActionResult GetSimple(int id) {
            return Ok(id);
        }

        // POST api/values
        public IHttpActionResult Post([FromBody]Values value) {
            if(value.Id != 0) {
                return BadRequest("Id should not be set on a new object.");
            }
            value.Id = new Random().Next();
            db.Add(value.Id, value);

            notify.Insert(value);
            return Ok(value);
        }

        // PUT api/values/5
        public IHttpActionResult Put(int id, [FromBody]Values value) {
            if(db[id] == null && id == value.Id) {
                return NotFound();
            }
            db[id] = value;
            notify.Update(value);
            return Ok();
        }

        // DELETE api/values/5
        public IHttpActionResult Delete(int id) {
            Values value;
            if(db.TryGetValue(id, out value)) {
                notify.Delete(value);
                db.Remove(id);
                return Ok();
            } else {
                return NotFound();
            }
        }
    }

    public class Values {
        public int Id { get; set; }
        public string Name { get; set; }
        public Values(int id) {
            this.Id = id;
            this.Name = ( Guid.NewGuid().ToString() );
        }
    }
}
