/**
 * @description Professional dashboard reviews page
 *              - Displays client reviews with rating, service, and date
 *              - Styled with orange, rose, and amber brand colors
 */

import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Jane Smith",
    service: "Plumbing Service",
    date: "10 Feb 2025",
    rating: 5,
    comment: "Excellent work, very professional and timely!",
  },
  {
    id: 2,
    name: "Michael Johnson",
    service: "Electrical Repair",
    date: "8 Feb 2025",
    rating: 4,
    comment: "Good service, but arrived a bit late.",
  },
  {
    id: 3,
    name: "Sarah Williams",
    service: "AC Installation",
    date: "5 Feb 2025",
    rating: 5,
    comment: "Perfect installation, highly recommend!",
  },
];

const Reviews = () => {
  return (
    <div className="md:p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-orange-600">Reviews</h1>
      <p className="text-rose-600">
        See what your clients are saying about your services.
      </p>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="rounded-2xl shadow-sm border border-amber-200"
          >
            <CardHeader>
              <CardTitle className="text-amber-700">{review.name}</CardTitle>
              <p className="text-sm text-rose-600">
                {review.service} • {review.date}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                ))}
              </div>
              <p className="text-slate-700 text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
