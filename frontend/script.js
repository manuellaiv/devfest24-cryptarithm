document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cryptarithm-form');
  const submitButton = document.getElementById('submit-btn');
  const resultContainer = document.getElementById('result-container');
  const resultDiv = document.getElementById('result');
  const loadingContainer = document.getElementById('loading-container');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page refresh

    submitButton.disabled = true;
    // Show loading state
    loadingContainer.classList.remove('d-none');
    resultContainer.classList.add('d-none'); // Hide the result container while loading

    const var1 = document.getElementById('var1').value;
    const var2 = document.getElementById('var2').value;
    const var_hasil = document.getElementById('var_hasil').value;

    fetch(`${BACKEND_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ var1, var2, var_hasil }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide loading state and show result
        loadingContainer.classList.add('d-none');
        resultContainer.classList.remove('d-none');

        // Display the result
        resultDiv.innerHTML = formatResult(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        resultDiv.innerHTML = `<span class="text-danger">An error occurred while solving the cryptarithm.</span>`;
        loadingContainer.classList.add('d-none');
        resultContainer.classList.remove('d-none');
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  });

  function formatResult(data) {
    if (data.error) {
      return `<div class="alert alert-danger" role="alert">${data.error}</div>`;
    }

    const { solution } = data;

    return `
      <div>
        <table class="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Letter</th>
              <th>Mapped Digit</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(solution)
              .map(
                ([letter, digit]) => `
                <tr>
                  <td>${letter}</td>
                  <td>${digit}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <p>The cryptarithm has been solved by mapping the above letters to the digits.</p>
      </div>
    `;
  }
});
