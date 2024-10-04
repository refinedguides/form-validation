const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("change", () => {
    validateInput(input);
  });
});

// disable browsers validation
form.noValidate = true;

// handle form submit event
form.addEventListener("submit", (e) => {
  if (!form.checkValidity()) {
    e.preventDefault(); // prevent form submission

    inputs.forEach(validateInput);
  } else {
    alert("form submitted successfully!");

    // Send data to the backend
  }
});

const validateInput = (input) => {
  let errorText = input.nextElementSibling;
  if (!errorText) {
    errorText = document.createElement("small");
    errorText.className = "error-text";
    input.insertAdjacentElement("afterend", errorText);
  }

  input.setCustomValidity("");
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title);
  }

  checkValidationRules(input);

  input.classList.toggle("invalid", !input.checkValidity());

  errorText.textContent = input.validationMessage;
};

const rules = {
  username: {
    disallowedWords: {
      words: ["offensive", "inappropriate"],
      error: "Username is invalid. Please choose another one.",
    },
  },
  "password-conf": {
    match: {
      target: "password",
      error: "Passwords do not match",
    },
  },
};

const checkValidationRules = (input) => {
  // skip inputs with no custom validation
  if (!rules[input.id]) return;

  for (const rule in rules[input.id]) {
    applyValidationRule(rule, input);
  }
};

const applyValidationRule = (rule, input) => {
  const ruleset = rules[input.id][rule];

  let error = ruleset.error;

  switch (rule) {
    case "match":
      const matchInput = document.getElementById(ruleset.target);
      if (!matchInput) {
        throw new Error(`${ruleset.target} field is not found`);
      }

      if (input.value !== matchInput.value) {
        input.setCustomValidity(error);
      }

      break;
    case "disallowedWords":
      // join the banned words into string and make it case insensitive
      const words = new RegExp(ruleset.words.join("|"), "i");
      if (words.test(input.value)) {
        input.setCustomValidity(error);
      }

      break;
  }
};
