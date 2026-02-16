/**
 * @description Professional dashboard services page
 *              - Lists available services with name and category
 *              - Provides quick actions to add or manage services
 */

import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import Button from "./components/Button";
import { Plus, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Plumbing Repair",
    category: "Plumbing",
  },
  {
    id: 2,
    name: "Electrical Installation",
    category: "Electrical",
  },
  {
    id: 3,
    name: "AC Maintenance",
    category: "HVAC",
  },
];

const Services = () => {
  return (
    <div className="md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-orange-600">Services</h1>
        <p className="text-rose-600">
          Manage the services you offer to clients.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="rounded-2xl shadow-sm border border-amber-200"
          >
            <CardHeader>
              <CardTitle className="text-amber-700">{service.name}</CardTitle>
              <p className="text-sm text-rose-600">{service.category}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Edit3 size={16} /> Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action */}
      <Link to={"add-service"}>
        <Button className="rounded-xl flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700">
          <Plus size={18} /> Add New Service
        </Button>
      </Link>
    </div>
  );
};

export default Services;
