import useServicesPro from "../../hooks/useServicesPro";

const Services = () => {
  const { services, loading, addService, updateService } = useServicesPro();

  if (loading) return <p>Loading services...</p>;

  return (
    <div>
      <h1>My Services</h1>
      {services.map(s => (
        <div key={s.id}>
          <p>{s.name} ({s.category})</p>
          <button onClick={() => updateService(s.id, { name: "Updated" })}>
            Edit
          </button>
        </div>
      ))}
      <button onClick={() => addService({ name: "New Service", category: "Plumbing" })}>
        Add Service
      </button>
    </div>
  );
};

export default Services;
