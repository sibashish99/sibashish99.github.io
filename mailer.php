<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if all required fields are set
    if (isset($_POST["full-name"]) && isset($_POST["email"]) && isset($_POST["subject"]) && isset($_POST["message"])) {
        $fullName = $_POST["full-name"];
        $email = $_POST["email"];
        $subject = $_POST["subject"];
        $message = $_POST["message"];

        // Set recipient email address
        $recipientEmail = "	sibashishreferral99@gmail.com";  // Replace with your actual email address

        // Construct email headers
        $headers = "From: $fullName <$email>" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Send the email
        $mailSent = mail($recipientEmail, $subject, $message, $headers);

        if ($mailSent) {
            // Success message
            echo "Message sent successfully.";
        } else {
            // Error message
            echo "Message could not be sent. Please try again later.";
        }
    } else {
        echo "All fields are required.";
    }
} else {
    echo "Invalid request method.";
}
?>
