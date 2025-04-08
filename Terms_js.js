document.addEventListener('DOMContentLoaded', function () {
    const showTextButton = document.getElementById('showTextButton');
    const displayText = document.getElementById('displayText');
    const copyTextButtonBottom = document.getElementById('copyTextButtonBottom');
    const copyNotification = document.getElementById('copyNotification');
    const donationQuestionContainer = document.getElementById('donationQuestionContainer');
    const donationYes = document.getElementById('donationYes');
    const donationNo = document.getElementById('donationNo');

    function formatURL(url) {
        url = url.trim();
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (url.startsWith("www.")) return "https://" + url;
        return "https://www." + url;
    }

    function createErrorMessage(id, message) {
        let errorElement = document.getElementById(id);
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = id;
            errorElement.style.color = 'red';
            errorElement.style.display = 'none';
            errorElement.innerText = message;
        }
        return errorElement;
    }

    const useCaseError = createErrorMessage('useCaseError', 'Please select a use case.');
    document.getElementById('useCaseForm').appendChild(useCaseError);

    const donationError = createErrorMessage('donationError', 'Please answer this question.');
    donationQuestionContainer.appendChild(donationError);

    document.querySelectorAll('input[name="usecase"]').forEach(radio => {
        radio.addEventListener('change', function () {
            donationQuestionContainer.style.display = this.value === 'Political' ? 'block' : 'none';
            useCaseError.style.display = 'none';
        });
    });

    showTextButton.addEventListener('click', function () {
        const organization = document.getElementById('organization').value.trim();
        let privacyPolicyLink = document.getElementById('pplink').value.trim();
        let formIsValid = true;

        if (!organization) {
            alert("Please enter your organization's name.");
            return;
        }

        const useCaseSelected = document.querySelector('input[name="usecase"]:checked');
        if (!useCaseSelected) {
            alert("Please select a use case.");
            return;
        }

        if (donationQuestionContainer.style.display === 'block') {
            const donationSelected = document.querySelector('input[name="donation"]:checked');
            if (!donationSelected) {
                donationError.style.display = 'block';
                formIsValid = false;
            } else {
                donationError.style.display = 'none';
            }
        }

        if (!privacyPolicyLink) {
            alert("Please enter a link to your Privacy Policy.");
            return;
        }
        
        if (!formIsValid) return;

        privacyPolicyLink = formatURL(privacyPolicyLink);

        let useCaseType = "informational";
        switch (useCaseSelected.value) {
            case "Political":
                useCaseType = donationYes.checked ? "political and/or donation-related" : "political";
                break;
            case "Charity":
                useCaseType = "donation-related";
                break;
            case "Customer Care":
                useCaseType = "customer support";
                break;
            case "Polling and Voting":
                useCaseType = "survey, polling, or voting-related (non-political)";
                break;
            case "Public Service Announcement":
                useCaseType = "public service announcement or informational";
                break;
            case "Higher Education":
                useCaseType = "higher education-related";
                break;
        }

        // Build help sentence
        let helpMethods = [];

        const emailChecked = document.getElementById('email2').checked;
        const email = document.getElementById('emailInput').value.trim();
        if (emailChecked && email) {
            helpMethods.push(`email us at <a href="mailto:${email}">${email}</a>`);
        }

        const websiteChecked = document.getElementById('checkboxWebsite').checked;
        const website = document.getElementById('websiteInput').value.trim();
        if (websiteChecked && website) {
            const formattedWebsite = formatURL(website);
            helpMethods.push(`visit our website at <a href="${formattedWebsite}" target="_blank">${formattedWebsite}</a>`);
        }

        const phoneChecked = document.getElementById('phone2').checked;
        const phone = document.getElementById('phoneInput').value.trim();
        if (phoneChecked && phone) {
            helpMethods.push(`call us at ${phone}`);
        }

        const addressChecked = document.getElementById('address2').checked;
        const address = document.getElementById('addressInput').value.trim();
        if (addressChecked && address) {
            helpMethods.push(`send mail to ${address}`);
        }

        const contactError = document.getElementById('contactError');
        const anyContactSelected = emailChecked || websiteChecked || phoneChecked || addressChecked;

        if (!anyContactSelected) {
            alert("Please add at least one contact method.");
            return;
        }

        let helpSentence = "For assistance, reply HELP";
        if (helpMethods.length > 0) {
            const lastMethod = helpMethods.pop();
            const joinedMethods = helpMethods.length > 0 ? helpMethods.join(", ") + ", or " + lastMethod : lastMethod;
            helpSentence += " or " + joinedMethods + ".";
        } else {
            helpSentence += ".";
        }

        // Validate selected contact methods
        const contactErrors = [];

        if (emailChecked && !email) {
            contactErrors.push("Email is checked but no email address is provided.");
            formIsValid = false;
        }

        if (websiteChecked && !website) {
            contactErrors.push("Website is checked but no URL is provided.");
            formIsValid = false;
        }

        if (phoneChecked && !phone) {
            contactErrors.push("Phone is checked but no number is provided.");
            formIsValid = false;
        }

        if (addressChecked && !address) {
            contactErrors.push("Address is checked but no address is provided.");
            formIsValid = false;
        }

        if (contactErrors.length > 0) {
            alert(contactErrors.join("\n"));
            return;
        }

        const privacyPolicyText = `<a href="${privacyPolicyLink}" target="_blank" rel="noopener noreferrer">here</a>`;

        const generatedText = 
            `<h1>Text Messaging Terms & Conditions</h1>
            By signing up for text message updates, you agree to receive ${useCaseType} text messages from ${organization} at the mobile number you provided. 
            Message frequency may vary based on your interactions, upcoming events, or important notices from ${organization}. 
            Message and data rates may apply depending on your mobile carrier plan. 
            ${helpSentence}
            You can reply STOP to opt out of text messages at any time. 
            Text messaging opt-in data and consent will not be sold or shared with third parties or affiliates for their marketing or promotional purposes. 
            For more information about how we collect, use, or share your data, please review our Privacy Policy ${privacyPolicyText}.`;

        displayText.innerHTML = `<p>${generatedText}</p>`;
        copyTextButtonBottom.style.display = 'block';
    });

    function copyToClipboard(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            showCopyNotification();
        } catch (err) {
            alert('Unable to copy text');
        }

        selection.removeAllRanges();
    }

    function showCopyNotification() {
        copyNotification.style.display = 'block';
        setTimeout(() => {
            copyNotification.style.display = 'none';
        }, 3000);
    }

    copyTextButtonBottom.addEventListener('click', function () {
        copyToClipboard(displayText);
    });

    function toggleFreeform(freeformId) {
        const freeformElement = document.getElementById(freeformId);
        if (freeformElement) {
            freeformElement.style.display = freeformElement.style.display === "none" ? "block" : "none";
        }
    }

    document.querySelectorAll('input[type="checkbox"][data-toggle-target]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            toggleFreeform(this.dataset.toggleTarget);
        });
    });
});
