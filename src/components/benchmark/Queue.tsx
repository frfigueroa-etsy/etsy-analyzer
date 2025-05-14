import {BenchmarkProductInterface } from '../../interfaces'

interface QueueProps {
    benchmark: BenchmarkProductInterface[];
    onRemove: (listing_id: number) => void;
    onClear: () => void;
  }


  const Queue: React.FC<QueueProps> = ({ benchmark, onRemove, onClear }) => {
    return (
      <div className="p-2 border rounded bg-white mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">🧺 Products</h6>
          <button onClick={onClear} className="btn btn-sm btn-outline-danger">🗑 Clear</button>
        </div>
        <ul className="list-group mb-2">
          {benchmark.map((p) => (
            <li key={p.listing_id} className="list-group-item d-flex justify-content-between align-items-center">
              <small className="fw-semibold">{p.title.slice(0, 50)}...</small>
              <button
                onClick={() => onRemove(p.listing_id)}
                className="btn btn-sm btn-outline-danger"
                title="Remove"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Queue;