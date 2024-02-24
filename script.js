// Set round number
var round_number = 1;
// Set number of words in a level
var number_of_words_in_a_level = 100;
// Initialise variables needed for game operation
var word_index;
var list_of_word_indexes = [];
var game_results = [];

function progress_game(){
    // This function checks which state the game is in using the text in the submit button and executes different code based on the result

    // Pull info from local storage
    var level = localStorage.getItem('level');

    // Attach elements to variables
    var test_image = document.getElementById('test_image');
    var stage_check = document.getElementById('submit_button').childNodes[0].nodeValue
    var body_square = document.getElementById('body_square');

    // Stage one - start
    if (stage_check == 'Start!') {
        // Generate random number to select word and append to list
        word_index = ((level - 1) * number_of_words_in_a_level) + Math.floor(Math.random() * (number_of_words_in_a_level));
        list_of_word_indexes.push(word_index)

        // Change game elements to match the chosen word
        document.getElementById('english').textContent=data[word_index].English;
        test_image.src = `Assets/Images/${data[word_index].English}_bw.png`;

        // Change button name for next stage
        document.getElementById('submit_button').childNodes[0].nodeValue='Submit'

        return;
    }

    // Stage two - submit
    if (stage_check == 'Submit') {

        // Change background colour based on gender of the noun
        if (data[word_index].Article == 'Der') {
            body_square.style.backgroundColor = 'rgba(77, 175, 255, 0.35)';
        }
        if (data[word_index].Article == 'Die') {
            body_square.style.backgroundColor = 'rgba(255, 76, 168, 0.35)';
        }
        if (data[word_index].Article == 'Das') {
            body_square.style.backgroundColor = 'rgba(255, 166, 77, 0.7)';
        }

        // Check to see if the game is over
        if (round_number == 10) {
            localStorage.setItem('list_of_word_indexes', list_of_word_indexes);
            localStorage.setItem('game_results', game_results);

            setTimeout(function(){
                window.location.href = 'results.html'
            }, 1500);
        }

        // Get all radio buttons with name 'article'
        var radio_buttons = document.getElementsByName('article');
            
        // Loop through radio buttons to find the selected one
        for (var i = 0; i < radio_buttons.length; i++) {
            if (radio_buttons[i].checked) {
                var selected_article = radio_buttons[i].value;
                radio_buttons[i].checked = false;
                break;
            }
        }

        // get word input and clean 
        var word_guess = document.getElementById('word_guess').value;
        word_guess = word_guess.replace(/\s/g, '');
        word_guess = word_guess.toLowerCase();
        document.getElementById('word_guess').value = '';

        // Check to see if the given answer is correct, change elements based on result
        var result_image = document.getElementById('result ' + round_number);
        if (selected_article == data[word_index].Article && word_guess == data[word_index].Singular.toLowerCase()) {
            result_image.src = 'Assets/Images/Correct.png';
            document.getElementById('accuracy').textContent='Correct!';
            game_results.push(1)
        } else {
            result_image.src = 'Assets/Images/Incorrect.png';
            document.getElementById('accuracy').textContent='Correct Answer: ' + data[word_index].Article + ' ' + data[word_index].Singular;
            game_results.push(0)
        }

        // Change button name for next stage
        document.getElementById('submit_button').childNodes[0].nodeValue='Next'

        // Increment round number
        round_number++;

        return;
    }

    // Stage three - next
    if (stage_check == 'Next') {
        // Generate random number
        word_index = ((level - 1) * number_of_words_in_a_level) + Math.floor(Math.random() * (number_of_words_in_a_level));
        list_of_word_indexes.push(word_index)

        // Change elements to match noun from random number
        test_image.src = `Assets/Images/${data[word_index].English}_bw.png`;
        document.getElementById('english').textContent=data[word_index].English;
        document.getElementById('accuracy').textContent=' ';

        // Reset background colour and change buttom name 
        body_square.style.backgroundColor = 'white';
        document.getElementById('submit_button').childNodes[0].nodeValue='Submit'
        return;
    }
}

function report_results() {
    // This function pushes all of the necesary data to the results page

    // Pull list of words used in the game
    var list_of_word_indexes = localStorage.getItem('list_of_word_indexes');
    var list_of_word_indexes = list_of_word_indexes.split(',').map(function(item) {return parseInt(item);});

    // Pull game results
    var game_results = localStorage.getItem('game_results');
    var game_results = game_results.split(',').map(function(item) {return parseInt(item);});

    // Loop through rouds
    for (let i = 1; i <= 10; i++) {

        // Set correct or incorrect
        if (game_results[i-1] == 1) {
            var result_image = document.getElementById('result ' + i);
            result_image.src = 'Assets/Images/Correct.png';
        } else {
            var result_image = document.getElementById('result ' + i);
            result_image.src = 'Assets/Images/Incorrect.png';
        }

        // Change article, noun, and english translation
        document.getElementById('article ' + i).textContent=data[list_of_word_indexes[i - 1]].Article;

        document.getElementById('noun ' + i).textContent=data[list_of_word_indexes[i - 1]].Singular;

        document.getElementById('English ' + i).textContent=data[list_of_word_indexes[i - 1]].English;

        // Get elements for the four words presented
        var article = document.getElementById('article ' + i);
        var singular = document.getElementById('noun ' + i);
        var the = document.getElementById('the ' + i);
        var english = document.getElementById('English ' + i);

        // Change colour of all words based on gender
        if (data[list_of_word_indexes[i - 1]].Article == 'Der') {
            article.style.color = 'rgba(77, 175, 255, 7)';
            singular.style.color = 'rgba(77, 175, 255, 7)';
            the.style.color = 'rgba(77, 175, 255, 7)';
            english.style.color = 'rgba(77, 175, 255, 7)';
        }
        if (data[list_of_word_indexes[i - 1]].Article == 'Die') {
            article.style.color = 'rgba(255, 76, 168, 7)';
            singular.style.color = 'rgba(255, 76, 168, 7)';
            the.style.color = 'rgba(255, 76, 168, 7)';
            english.style.color = 'rgba(255, 76, 168, 7)';
        }
        if (data[list_of_word_indexes[i - 1]].Article == 'Das') {
            article.style.color = 'rgba(255, 166, 77, 1)';
            singular.style.color = 'rgba(255, 166, 77, 1)';
            the.style.color = 'rgba(255, 166, 77, 1)';
            english.style.color = 'rgba(255, 166, 77, 1)';
        }

        // Find the associated picture
        var test_image = document.getElementById('colour ' + i);
        test_image.src = `Assets/Images/${data[list_of_word_indexes[i - 1]].English}_bw.png`;;

      }

      // Calculate results ratio
      document.getElementById('results ratio').textContent=game_results.reduce((a, b) => a + b, 0) + '/10';
}