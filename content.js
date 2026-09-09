let preferencesOuvertes = false;
let observer;

function normaliserTexte(texte)
{
return texte
    .trim()
    .toLowerCase()
    .replace(/[→›»>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function estTextesRefus(element)
{
    const texte = normaliserTexte(element.innerText || "");

    const textesRefuser = 
    [
        "refuser",
        "tout refuser",
        "refuser tout",
        "reject all",
        "decline",
        "continuer sans accepter",
        "tout rejeter",
        "fermer sans accepter les cookies",
        "refuser les cookies optionnels",
        "cookies nécessaires uniquement",
        "décliner les cookies facultatifs"
    ];

    return textesRefuser.includes(texte);
}

function estTextesPreferences(element)
{
    const texte = normaliserTexte(element.innerText || "")

    const textesPreferences = 
    [
        "gérer vos préférences",
        "gérer mes préférences",
        "personnaliser",
        "paramétrer",
        "manage preferences",
        "manage options",
        "manage cookies",
        "gérer les options"
    ];

    return textesPreferences.includes(texte);
}

function estTextesConfirmation(element)
{
    texte = normaliserTexte(element.innerText || "")

    const textesConfirmation = 
    [
        "confirmer les choix",
        "confirm my choices"
    ];

    return textesConfirmation.includes(text);
}

function estInteractif(element)
{
    return 
    (
        element.tagName === "BUTTON" ||
        element.tagName === "A"      ||
        element.getAttribute("role") === "button"
    )
}

function chercherActionCookies()
{
    const elements = document.querySelectorAll
    (
        "button, [role='button'], a, span"
    );

    for (const element of elements)
    {
        const texteBrut = element.innerText;

        if (!texteBrut)
        {
            continue;
        }

        const texte = normaliserTexte(texteBrut);

        // 1. Refus direct
        if (estTextesRefus(texte))
        {
            console.log("Élément de refus trouvé :", element);

            element.click();

            observer?.disconnect();

            return;
        }

        // 2. Ouverture des préférences
        if 
        (
            estTextesPreferences(texte) &&
            !preferencesOuvertes
        )
        {
            console.log("Ouverture des préférences :", element);

            preferencesOuvertes = true;
            element.click();

            return;
        }

        // 3. Confirmation après modification des préférences
        if 
        (
            preferencesOuvertes &&
            textesConfirmation.includes(texte)
        )
        {
            const casesCochees = document.querySelectorAll
            (
                'input[type="checkbox"]:checked'
            );

            casesCochees.forEach((caseCochee) => 
                {
                console.log("Case désactivée :", caseCochee);
                caseCochee.click();
            });

            console.log("Confirmation des choix :", element);

            element.click();

            observer?.disconnect();

            return;
        }
    }
}

observer = new MutationObserver(() => 
{
    chercherActionCookies();
});

observer.observe(document.body, 
{
    childList: true,
    subtree: true
});

chercherActionCookies();