using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Runtime.Serialization;

namespace linq.hubs {
    public class DataHub : Hub {
        public void Hello() {
            Clients.All.hello();
        }
    }
}