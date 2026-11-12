
import React from 'react';

const Supports = ({
  phase,
  used,
  onPreview,
  onInsurance,
  onHint
}) => {
  return (
    <section className="supports">
      <h3>Quyền trợ giúp</h3>

      <div className="support-actions">
        <button
          type="button"
          disabled={used.preview || phase !== 'bet'}
          onClick={onPreview}
        >
          {used.preview ? 'Đã xem trước' : 'Xem trước'}
        </button>

        <button
          type="button"
          disabled={
            used.insurance ||
            !['bet', 'answer'].includes(phase)
          }
          onClick={onInsurance}
        >
          {used.insurance ? 'Đã bảo hiểm' : 'Bảo hiểm'}
        </button>

        <button
          type="button"
          disabled={used.hint || phase !== 'answer'}
          onClick={onHint}
        >
          {used.hint ? 'Đã dùng gợi ý' : 'Gợi ý'}
        </button>
      </div>
    </section>
  );
};

export default Supports;
