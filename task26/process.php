<?php
// ----------------------------------------------------------------
// process.php — reads the form data, validates it, then uses
// PHP variables + loops + conditionals to build a fun result.
// ----------------------------------------------------------------

$name    = trim($_POST['name'] ?? '');
$age     = trim($_POST['age'] ?? '');
$hobbies = $_POST['hobbies'] ?? [];

$errors = [];
if ($name === '') {
    $errors[] = "Don't forget your name!";
}
if ($age === '' || !is_numeric($age) || (int)$age <= 0) {
    $errors[] = "Age must be a real, positive number.";
}

// ---- "Coder Type" badge logic — a simple if/elseif chain based on hobby count ----
$hobbyCount = count($hobbies);
if ($hobbyCount === 0) {
    $badge = "The Mysterious Lurker 🕵️";
} elseif ($hobbyCount === 1) {
    $badge = "The Focused Specialist 🎯";
} elseif ($hobbyCount <= 3) {
    $badge = "The Balanced Explorer 🧭";
} else {
    $badge = "The Renaissance Coder 🌟";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Result 🎉</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0; min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      padding: 20px;
    }
    .card {
      background: #fff; max-width: 440px; width: 100%;
      padding: 32px; border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.25); text-align: center;
    }
    .error-box { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 10px; margin-bottom: 10px; font-size: 14px; text-align: left; }
    .badge {
      display: inline-block; font-size: 15px; font-weight: 700; color: #764ba2;
      background: #efe9fb; padding: 8px 16px; border-radius: 999px; margin: 12px 0 20px;
    }
    h1 { font-size: 22px; color: #2d2540; margin: 0 0 4px; }
    .sub { color: #7c7391; font-size: 14px; margin-bottom: 6px; }
    .hobby-list { list-style: none; padding: 0; margin: 16px 0; text-align: left; }
    .hobby-list li {
      background: #f6f4fb; padding: 10px 14px; border-radius: 10px;
      margin-bottom: 8px; font-weight: 600; color: #4b3f6b; font-size: 14px;
    }
    .stars { font-size: 22px; margin: 10px 0; }
    a.back {
      display: inline-block; margin-top: 20px; color: #764ba2;
      font-weight: 700; text-decoration: none; font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">

    <?php if (!empty($errors)): ?>
      <h1>Oops! 🙈</h1>
      <?php foreach ($errors as $error): // Loop #1: show each validation error ?>
        <div class="error-box">⚠️ <?php echo htmlspecialchars($error); ?></div>
      <?php endforeach; ?>

    <?php else: ?>
      <h1>Hey <?php echo htmlspecialchars($name); ?>! 👋</h1>
      <p class="sub">Age <?php echo htmlspecialchars($age); ?> · Here's your verdict:</p>
      <div class="badge"><?php echo $badge; ?></div>

      <?php if ($hobbyCount > 0): ?>
        <ul class="hobby-list">
          <?php
          // Loop #2: foreach over the hobbies array submitted from checkboxes
          foreach ($hobbies as $hobby): ?>
            <li><?php echo htmlspecialchars($hobby); ?></li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <p class="sub">No hobbies picked — mysterious indeed. 🤫</p>
      <?php endif; ?>

      <div class="stars">
        <?php
        // Loop #3: a classic for loop, printing one star per hobby chosen
        for ($i = 0; $i < $hobbyCount; $i++) {
            echo "⭐";
        }
        ?>
      </div>
    <?php endif; ?>

    <a class="back" href="form.html">← Try again</a>
  </div>
</body>
</html>
