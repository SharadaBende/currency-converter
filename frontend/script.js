async function convert() {
    try {
        let from = document.getElementById("from").value;
        let to = document.getElementById("to").value;
        let amount = document.getElementById("amount").value;

        console.log("Clicked:", from, to, amount);

        if (!from || !to || !amount) {
            document.getElementById("result").innerText =
                "⚠️ Please fill all fields";
            return;
        }

        let response = await fetch(
            `http://127.0.0.1:5000/convert?from=${from}&to=${to}&amount=${amount}`
        );

        console.log("Response status:", response.status);

        let data = await response.json();
        console.log("API response:", data);

        if (response.ok && data.converted) {
            document.getElementById("result").innerText =
                `${data.amount} ${data.from} = ${data.converted} ${data.to}`;
        } else {
            document.getElementById("result").innerText =
                "❌ Conversion failed. Check console.";
        }

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerText =
            "❌ Network error. Backend not reachable.";
    }
}