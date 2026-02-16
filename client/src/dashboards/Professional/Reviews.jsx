import useReviewsPro from "../../hooks/useReviewsPro";

const Reviews = () => {
  const { reviews, loading } = useReviewsPro();

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div>
      <h1>Client Reviews</h1>
      {reviews.map(r => (
        <div key={r.id}>
          <p>{r.comment}</p>
          <p>Rating: {r.rating}/5</p>
          <p>By: {r.userName}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
