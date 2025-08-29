const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to check if a string is a number
function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// Helper function to check if a character is alphabetic
function isAlphabet(char) {
    return /^[a-zA-Z]$/.test(char);
}

// Helper function to check if a character is special
function isSpecialCharacter(char) {
    return /^[^a-zA-Z0-9]$/.test(char);
}

// Helper function to create alternating caps string
function createAlternatingCaps(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            result += str[i].toLowerCase();
        } else {
            result += str[i].toUpperCase();
        }
    }
    return result;
}

// Main processing function
function processData(dataArray) {
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;
    const allAlphabets = [];

    for (const item of dataArray) {
        const itemStr = String(item);
        
        // Check if it's a number
        if (isNumber(itemStr)) {
            const num = parseInt(itemStr);
            sum += num;
            
            if (num % 2 === 0) {
                evenNumbers.push(itemStr);
            } else {
                oddNumbers.push(itemStr);
            }
        }
        // Check if it's a single alphabet or string of alphabets
        else if (/^[a-zA-Z]+$/.test(itemStr)) {
            alphabets.push(itemStr.toUpperCase());
            // Add each character to allAlphabets for concatenation
            for (const char of itemStr) {
                allAlphabets.push(char);
            }
        }
        // Check for single special characters
        else if (itemStr.length === 1 && isSpecialCharacter(itemStr)) {
            specialCharacters.push(itemStr);
        }
        // Handle mixed strings (like "ABcD" which contains only alphabets)
        else {
            // Process each character individually
            for (const char of itemStr) {
                if (isNumber(char)) {
                    const num = parseInt(char);
                    sum += num;
                    
                    if (num % 2 === 0) {
                        evenNumbers.push(char);
                    } else {
                        oddNumbers.push(char);
                    }
                } else if (isAlphabet(char)) {
                    allAlphabets.push(char);
                } else if (isSpecialCharacter(char)) {
                    specialCharacters.push(char);
                }
            }
            
            // If the entire string is alphabetic, add it to alphabets array
            if (/^[a-zA-Z]+$/.test(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
            }
        }
    }

    // Create concatenated string in reverse order with alternating caps
    const reversedAlphabets = allAlphabets.reverse().join('');
    const concatString = createAlternatingCaps(reversedAlphabets);

    return {
        oddNumbers,
        evenNumbers,
        alphabets,
        specialCharacters,
        sum: sum.toString(),
        concatString
    };
}

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        // Validation
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input: 'data' must be an array"
            });
        }

        // Process the data
        const result = processData(data);

        // Response
        const response = {
            is_success: true,
            user_id: "tanuj_katyal_18092004", 
            email: "tanujkatyal123@gmail.com", 
            roll_number: "22BCE0598",
            odd_numbers: result.oddNumbers,
            even_numbers: result.evenNumbers,
            alphabets: result.alphabets,
            special_characters: result.specialCharacters,
            sum: result.sum,
            concat_string: result.concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            message: "Internal server error"
        });
    }
});

// GET route for /bfhl (optional, for testing)
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: "Full Stack REST API is running!",
        endpoints: {
            "POST /bfhl": "Main endpoint for data processing",
            "GET /bfhl": "Returns operation code"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
});

module.exports = app;