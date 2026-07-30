Alisha Website — Interactive Quiz

This branch adds a small interactive quiz that helps visitors discover the book genres they prefer and provides recommendations, including a highlighted "Alisha's pick" for each genre with a short review.

Files added in feature/interactive-quiz:
- index.html — Quiz UI, results, and Alisha's pick section
- styles.css — Styling for the refreshed layout and quiz
- script.js — Quiz logic, recommendations, and Alisha's pick content

How to customize
- Questions: edit the `questions` array in script.js. Each question has `q` and `options` where each option maps to a `genre` string.
- Recommendations & Alisha's pick: edit the `recommendations` object in script.js. Each genre key should contain `list` (array of {title}) and `alishaPick` ({title, review}).

Live API (optional)
- If you prefer dynamic book recommendations, we can replace the static `recommendations` object with a fetch to Open Library (e.g., https://openlibrary.org/subjects/fantasy.json?limit=5) and map the returned works into the UI. I can add this on request.

Next steps I can take (pick one):
- Open a pull request from feature/interactive-quiz into your default branch with a short description.
- Add Open Library integration with graceful fallback.
- Tweak visuals (font, colors, images) or add analytics.
