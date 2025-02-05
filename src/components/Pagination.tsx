type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  dogIdsList: string[];
  size: number;
};

export default function Pagination({
  page,
  setPage,
  dogIdsList,
  size
}: PaginationProps) {
  return (
    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <button
        onClick={() => setPage(Math.max(page - 1, 0))}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={dogIdsList.length < size}
      >
        Next
      </button>
    </div>
  );
}
