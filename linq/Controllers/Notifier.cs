using linq.hubs;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace linq.Controllers {
    public class Notifier <T> {
        public string TableName;

        public Notifier (string table) {
            this.TableName = table.ToLower();
        }

        public void Update (T value) {
            Trigger<T>(TableName, ChangeType.Update, value);
        }

        public void Delete (T value) {
            Trigger<T>(TableName, ChangeType.Delete, value);
        }

        public void Insert (T value) {
            Trigger<T>(TableName, ChangeType.Insert, value);
        }

        public static void Trigger <J> (String table, ChangeType mod, J value) {
            var hub = GlobalHost.ConnectionManager.GetHubContext<DataHub>();
            hub.Clients.All.tableChanged(table, mod.ToString(), value);
        }

    }
    public enum ChangeType {
        Update, Insert, Delete
    }
}