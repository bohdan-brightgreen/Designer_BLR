<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Projector Brightgreen</title>

	<link href="/favicon.ico" rel="shortcut icon">

	<link href="{{ elixir('css/error.css') }}" rel="stylesheet">
</head>
<body>
<div class="body-container">

	<main class="screen-center">
		<section class="frame">
			@yield('content')
		</section>
	</main>

	<footer>
		<p>&copy; Copyright {{ date('Y') }} <a href="https://brightgreen.com" target="_blank">Brightgreen Pty Ltd</a>. All rights reserved.</p>
	</footer>

</div>
</body>

</html>