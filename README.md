[![Build Status](https://travis-ci.org/brennon/eim.svg)](https://travis-ci.org/brennon/eim) [![Dependency Status](https://david-dm.org/brennon/eim.png)](https://david-dm.org/brennon/eim.png) [![Coverage Status](https://coveralls.io/repos/brennon/eim/badge.svg?branch=master&service=github)](https://coveralls.io/github/brennon/eim?branch=master)[![Code Climate](https://codeclimate.com/github/brennon/eim/badges/gpa.svg)](https://codeclimate.com/github/brennon/eim)

# Emotion in Motion

This is the Emotion in Motion experiment framework from the Music, Sensors and Emotion research group. For more information, contact us at [emotion.in.motion@musicsensorsemotion.com](mailto:emotion.in.motion@musicsensorsemotion.com).

# Installation

1. Clone the EiM git repository:

    ```
    git clone https://github.com/brennon/eim.git
    ```

2. If you don't have git installed, and don't want to install it, you can download a [zipped archive](https://github.com/brennon/eim/archive/master.zip) of the repository.

3. Install [MongoDB](https://www.mongodb.org/). If you're on a Mac and use [Homebrew](http://brew.sh/), use:

    ```
    brew install mongodb
    ```

4. Start `mongod` on the default port. If you installed with Homebrew:

    ```
    mongod --config /usr/local/etc/mongod.conf
    ```

3. Install [Node.js](https://nodejs.org/). The framework currently runs best on Node.js [v0.12.7](https://nodejs.org/dist/v0.12.7/). We recommend downloading the Node.js installer from this link, instead of installing with Homebrew.

4. Install app Node dependencies using `npm`:

    ```
    npm install
    ```

5. To get started using with the default Emotion in Motion MongoDB databases, import the data from the `mongodb-dump` directory. From the root directory of the repository:

    ```
    mongorestore -d emotion-in-motion-dev --drop ./mongodb-dump/emotion-in-motion-dev
    mongorestore -d emotion-in-motion-test --drop ./mongodb-dump/emotion-in-motion-test
    mongorestore -d emotion-in-motion-production --drop ./mongodb-dump/emotion-in-motion-production
    ```

5. Start the Max helper project located at `EiMpatch/EmotionInMotion.maxproj`. You'll need [Max 6](https://cycling74.com/) or later.

6. Start the server. In the root directory of the repository:

    ```
    node_modules/grunt-cli/bin/grunt
    ```

7. Browse to [http://localhost:3000/](http://localhost:3000/).
 
# Study Specification Structure
 
A study using Emotion in Motion is described by a MongoDB document (much like a JSON file) stored in the MongoDB database. Specifying study structures in this way essentially means that only knowledge of JSON is required in order to create a new study that requires only the modification of components already present in the provided demonstration study. JSON is a simple, textual format for representing structured data--see [this site](http://blog.scottlowe.org/2013/11/08/a-non-programmers-introduction-to-json/) for a gentle introduction.

By default, the application looks in the `experimentschemas` collection in the database for study specification documents. If more than one of these documents are present, one is chosen at random for presenting your study to the participant. (Thus, if only one of these documents is present, the structure described by this document will be the structure that is always used.) The demo application contains and presents only one study with the following structure:

1. Welcome screen
2. Consent form
3. Several instructions screens (including audio tests and sensor placement)
4. Several preliminary questionnaires
5. Playback of a 'control' sound
6. Questionnaire about the control sound
7. Playback of a randomly selected sound excerpt
8. Questionnaire about the previous sound excerpt
9. Final questionnaire
10. Emotion indices
11. Thank you screen

This structure is *completely* customizable, which we describe below. This default study, like any other study, is described in a MongoDB document. This MongoDB document has the following basic structure:

```
{  
    "trialCount" : 2, 
    "mediaPool" : [
        ObjectId("547c92686577a50a2ebde518"), 
        ObjectId("547c92956577a50a2ebde519"), 
        ObjectId("547c92cb6577a50a2ebde51a"), 
        ...
    ], 
    "sensors" : [
        "eda", 
        "pox"
    ],
    "structure" : [
        {
            "name" : "consent-form"
        }, 
        {
            "name" : "start"
        }, 
        {
            "name" : "sound-test"
        }, 
        {
            "name" : "eda-instructions"
        }, 
        {
            "name" : "pox-instructions"
        }, 
        {
            "name" : "signal-test"
        }, 
        {
            "name" : "questionnaire", 
            "data" : { ... }
        }, 
        {
            "name" : "questionnaire", 
            "data" : { ... }
        }, 
        {
            "name" : "questionnaire", 
            "data" : { ... }
        }, 
        {
            "name" : "media-playback", 
            "mediaType" : "fixed", 
            "media" : ObjectId("547c92416577a50a2ebde517")
        }, 
        {
            "name" : "questionnaire", 
            "data" : { ... }
        }, 
        {
            "name" : "media-playback", 
            "mediaType" : "random"
        }, 
        {
            "name" : "questionnaire", 
                        "data" : { ... }
        }, 
        {
            "name" : "questionnaire", 
            "data" : { ... }
        }, 
        {
            "name" : "emotion-index"
        }, 
        {
            "name" : "thank-you"
        }
    ]
}
```

## Top Level Members

At the top level of the JSON object, we have four properties: `trialCount`, `mediaPool`, `sensors`, and `structure`.

### `trialCount`

The `trialCount` property takes an integer for its value that specifies the number of media excerpts that will be presented over the course of the session. Here, we specify that two media excerpts will be played:

```
{
    "trialCount" : 2,
    ...
}
```

### `mediaPool`

The `mediaPool` property takes an array as its value. This array holds the `ObjectId`s of MongoDB documents stored in the MongoDB database that represent all media files that are available for presentation during a session. The framework will randomly draw as many media files for presentation from this array as are specified by the `trialCount` property. This property is **required**.

### `sensors`

The `sensors` property specifies those sensors that will be used during the study session. This property is currently not observed by the framework: the Max helper application records the sensor data directly to files that are stored on disk.

### `structure`

The `structure` property describes the structure of the study itself. It takes as its value an array of nested objects. Each of these nested objects describes a slide that will be presented as the participant advances through the session. The order of slides in the `structure` property matches the order of slides as they are presented to the participant. This property is **required**.

#### `structure` 'Slides'

The objects nested under the `structure` property each describe one slide in the study session. Objects that provide only a `name` property represent a slide that has been hard-coded into the Emotion in Motion framework. For instance, this example `structure` property presents only the consent form, EDA and POX sensor instructions, and thank you screens:

```
{
    "structure": [
        {
            "name" : "consent-form"
        }, 
        {
            "name" : "eda-instructions"
        },
        {
            "name" : "pox-instructions"
        }, 
        {
            "name" : "thank-you"
        }
    ]
}
```

It should be clear how the names of these slides correspond to the sections referenced at the beginning of [Study Specification Structure](#study-specification-structure). To change the text or design of any of the slides that *only include a `name` property*, edit their corresponding HTML files in `public/modules/core/views/`. For instance, to change the text of the consent form, simply edit `public/modules/core/views/consent-form.client.view.html`.

Other slides in the `structure` property's array may also have a `data` property. Such slides represent slides that are dynamically constructed automatically based on the information you provide in the data array. These often represent slides that present questionnaires, etc., where you may want to ask different questions than those included in the base Emotion in Motion application. In fact, at present, the only type of slide object that supports a `data` property *is* the `questionnaire` slide.

##### Questionnaire Slides

For now, we expect that most people's needs will be me with the ability to design experiments that involve presenting some static information to participants, presenting them with a number preselected or randomly selected media excerpts, and asking them questions at various times. We'll describe below how to configure [media slides](#media-slides), and we've already discussed how to edit 'static' slides (see [Adding Slides](#adding-slides) for instructions on how to add your own custom, static slides.) Here, we describe the third big piece of the puzzle, how to design questionnaires using the questionnaire slide type.

As noted previously, questionnaire slide objects support an additional `data` property:

```
{
    "structure": [
        {
            "name": "questionnaire",
            "data": { ... }
        }
    ]
}
```

Much like the outer JSON object describes an overall study session, the `data` property of a `questionnaire`-`name` slide describes a questionnaire-based slide itself. The `data` property takes an object as its value, and supports three properties on this object: `title`, `introductoryText`, and `structure`.

###### Questionnaire `title` Property

The `title` property of a `questionnaire`'s `data` object takes a string that will be displayed as the title header of the screen. This property is **required**.

###### Questionnaire `introductoryText` Property

The `introductoryText` property of a `questionnaire`'s `data` object takes a string that will be displayed below the title header. This property is optional.

###### Questionnaire `structure` Property

The `structure` property of a `questionnaire`'s `data` object takes an array of objects that represent, in order, the individual questions presented on the questionnaire. This property is required. The allowed properties of the individual question objects are described here.

**`questionType`**

A question object can be of one of four types: a Likert-type scale question, a group of radio buttons (from which one choice is allowed), a group of checkboxes (from which zero, one, or more choices are allowed), or a dropdown selection list. To specify the type of question, supply one of the following strings as the value for the `questionType` property: `"likert"`, `"radio"`, `"checkbox"`, or `"dropdown"`. This property is **required**.

**`questionId`**

The `questionId` property is used to dynamically associate the various parts of the question together. This identifier must be a string and must be unique among all questions included in the questionnaire. This property is **required**.

**`questionLabel`**

The `questionLabel` property takes a string that is used as the question text itself. This property is **required**.

**`questionLabelType`**

The `questionLabelType` property is not currently used.

**`questionLikertMinimumDescription`**

The `questionLikertMinimumDescription` takes a string that is used as a description at the left-most end of the Likert-type scale. This property is optional.

**`questionLikertMaximumDescription`**

The `questionLikertMaximumDescription` takes a string that is used as a description at the right-most end of the Likert-type scale. This property is optional.

**`questionStoragePath`**

The `questionStoragePath` property represents a dot-delimited path into the [`trialData` object](#trialData-objects) that is generated as the participant completes the session. This `trialData` object holds all information about the participant's session. Typically, all input received from the participant is stored in a top-level property of this object named "data". So, to store the participant's response to a question about their musical experience, we might specify the `questionStoragePath` property for this question as `data.questionnaire_two.musical_expertise`. This would result in a `trialData` object that looks something like the following (with other distracting information removed):

```
{
    \\ Other properties here
    data: {
        questionnaire_two: {
            musical_expertise: \\ Participant's response for this question as this value
            \\ Perhaps other responses here
        }
    }
}
```

The `questionStoragePath` property is **required**.

**`questionRadioOptions`**

When `"radio"` is specified as the value for the `questionType` property, the application expects a `questionRadioOptions` property to be provided, as well. The `questionRadioOptions` property contains the information to be used for the individual radio buttons. This is an ordered array of objects: each object represents one radio button. Each object should have a `label` property that is used as the label for the radio button, and a `value` property that is used for the value stored in the `trialData` object when the participant selects this particular radio button:

```
[ {"label": "Yes", "value": true}, {"label": "No", "value": false} ]

\\ Providing this value for `questionRadioOptions` would result in two radio buttons. The first would be given a label in the on-screen questionnaire of "Yes" and the second would be given a label of "No". Should the participant select the first button, the Boolean value `true` will be stored for their response. The Boolean value `false` will be stored should they select the second button.

[ {"label" : "Male", "value" : "male"}, {"label" : "Female", "value" : "female"} ]

\\ Providing this value for `questionRadioOptions` would result in two radio buttons. The first would be given a label in the on-screen questionnaire of "Male" and the second would be given a label of "Female". Should the participant select the first button, the string "male" will be stored for their response. The string "female" will be stored should they select the second button.

[ {"label" : "Male", "value" : 1}, {"label" : "Female", "value" : 2}, {"label" : "Not Specified", "value" : 3} ]

\\ Providing this value for `questionRadioOptions` would result in three radio buttons. The first would be given a label in the on-screen questionnaire of "Male", the second would be given a label of "Female", and the third would be given a label of "Not Specified". Should the participant select the first button, the number 1 will be stored for their response. Similarly, the numbers 2 and 3 would be specified for the selection of the second or third buttons, respectively.
```

**`questionOptions`**

This (currently poorly named) property is used for `"likert"` questions much like the `questionRadioOptions` is used for `"radio"` questions. The value, again, should be an ordered array of objects that are used to label the points along a five-point Likert-type scale. Here, only labels are required:

```
[
    {"label": "Disagree strongly"},
    {"label": "Disagree a little"},
    {"label": "Neither agree nor disagree"},
    {"label": "Agree a little"},
    {"label": "Agree strongly"}
]
```

**`questionCheckboxOptions` and `questionDropdownOptions`**

As `questionRadioOptions` is to `"radio"` questions, `questionCheckboxOptions` is to `"checkbox"` questions, and `questionDropdownOptions` is to `"dropdown"` questions. This property takes an ordered array of strings to use as either the checkbox labels or the options available for selection in the dropdown selection list. For instance, to specify three checkboxes with the labels "Apple", "Orange", and "Banana", give `questionCheckboxOptions` the following value:

```
[ "Apple", "Orange", "Banana" ]
```

On the other hand, to provide a dropdown list with the same values, but in a different order, give `questionDropdownOptions` the following value:

```
[ "Orange", "Apple", "Banana" ]
```

**`questionDropdownOptions`**

Ordered array of strings to use as dropdown list.

**`questionLikertLeftImageSrc` and `questionLikertRightImageSrc`**

The optional `questionLikertLeftImageSrc` and `questionLikertRightImageSrc` properties take strings as value that represent the paths to images to be displayed at the left and right sides of a Likert-type scale, respectively:

```
{
    ...,
    "questionLikertLeftImageSrc": "/modules/core/img/scale-left-engaged.png",
    "questionLikertRightImageSrc": "/modules/core/img/scale-right-engaged.png",
    ...
}
```

**`questionLikertSingleImageSrc`**

The optional `questionLikertSingleImageSrc` property takes a string as its value that represents the path to an image to be displayed above and centered over a Likert-type scale:

```
{
    ...,
    "questionLikertSingleImageSrc": "/modules/core/img/scale-above-positivity.png",
    ...
}
```

**`questionIsAssociatedToMedia`**

The required `questionIsAssociatedToMedia` property specifies that a question corresponds to a particular media excerpt by taking a Boolean `true` or `false` as its value. When this value is set to `true`, multiple responses for questions with the same `questionStoragePath` property are stored in an ordered array that is used as the value for the `questionStoragePath` property in the final `trialData` document.

For example, in the demonstration study provided with the framework, two media excerpts are played. We present the same questionnaire to the participant following each media excerpt. In order to specify that responses on the questionnaire following the first excerpt are associated with the first excerpt (and the same for the second questionnaire and excerpt), the values for `questionIsAssociatedToMedia` for all questions in these questionnaires are all set to `true`. So, for those questons with their `questionStoragePath` property set to `"data.answers.positivity"`, the corresponding section of a participant's `trialData` document might look something like this:
 
 ```
 {
    data: {
        answers: {
            positivity: [2, 5]
        }
    }
}
```

Here, the participant chose a value of `2` when responding to the positivity question following the first excerpt. Likewise, they chose a value of `5` when responding to the positivity question following the second excerpt.

**`questionRequired`**

Specifying `true` as the value for the `questionRequired` property indicates that the participant *must* answer this question before being allowed to proceed. Correspondingly, specifying `false` for this value indicates that the participant may proceed without answering this question.

##### Media Slides

Media slides are created by giving a slide object the name `"media-playback"`. In addition to the `name` property, their objects take two more properties: `mediaType` and `media`.

**`mediaType`**

The `mediaType` property is **required**, and specifies that this media excerpt is either pre-specified, or that this media excerpt is to be selected randomly from the media pool specified in the top-level [`mediaPool`](#mediaPool) property. To specify that the media is to be a set, pre-selected excerpt, give `mediaType` the value `"fixed"`. Use the value `"random"` to specify that the excerpt should be randomly selected from the media pool.

**`media`**

If `mediaType` is `"fixed"`, you must specify the `ObjectId` of the media to use for the media excerpt. This `ObjectId` does not necessarily need to be included in the `mediaPool` array.

These are example slide objects for fixed and random media excerpts, respectively:

```
{
    "name" : "media-playback", 
    "mediaType" : "fixed", 
    "media" : ObjectId("547c92416577a50a2ebde517")
}
```

```
{
    "name" : "media-playback", 
    "mediaType" : "random"
}
```

# Content and Design

## Editing the Welcome Screen

The first screen shown during the study is easy to customize. Simply edit the file at `public/modules/core/views/home.client.view.html` to suit your needs.

## Changing the Visual Design

The simplest means of changing the visual design of a study is by editing the CSS files that govern the visual styling of the website. The main CSS file is located at `public/modules/core/css/core.css`. You may also provide your own CSS file. All CSS files (that end with the `.css` extension) placed in the `public/modules/**/css/` folders will be included.

## Adding Custom Slides

Adding your own slides is straightforward, and involves three separate steps:

1. Construct the HTML file for your slide.
2. Add an entry to the routing file.
3. Include your slide's name in the structure design document for your study in the MongoDB database.

### Constructing the HTML File for Your Slide

The easiest way to go about doing this is by following the example of one of the existing HTML files in the `public/modules/core/views/` directory. There are a few important points to note about these files.

First, the Emotion in Motion framework uses the [Bootstrap](http://getbootstrap.com/) front-end framework for its visual styling. Most of the outer structure of each page is defined for you. Therefore, the HTML file for an individual slide needs to only contain what is to be presented as the actual slide content (there's no need to worry about the header, menus, etc.) For instance, this is (most of) the content of the file at `public/modules/core/views/pox-instructions.client.view.html`:

```
<div class="row">
    <div class="col-md-12">

        <h1 translate>Heart Sensor</h1>

        <p translate>Now, insert your index finger into the grey plastic clip. Your finger should touch the rubber stopper at the end.</p>
    </div>
</div>
<div class="row">
    <div class="col-md-12 text-center">
        <img src="/modules/core/img/hand-pox.png">
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <p><button class="btn btn-primary btn-lg" data-ng-click="advanceSlide()" translate>Continue</button></p>
    </div>
</div>
```

Of note, each 'section' of the slide is surrounded with a `div` styled with the `row` class provided by Bootstrap. This particular slide is made of three rows. The first row gives the header title of the slide and a paragraph with instructions. The second row contains a centered image. The final row presents the button that allows the user to advance to the next slide. All styling (and layout) is accomplished through classes provided by Bootstrap; get to know its simple collection of classes--they are your friends for easily accomplishing even the most complex of layouts. Of course, nothing is stopping you from simply entering text here--you're free to include whatever you'd like.

Take particular note of two things in this HTML. First, the tags that surround all text provided on this slide use the `translate` [AngularJS](https://angularjs.org/) directive (e.g., `<h1 translate>Heart Sensor</h1>`). Any tags that include this directive will be automatically translated to the selected language of the user, provided that you have [provided the necessary translations](#internationalization). Second, the `button` in the bottom row of the slide includes the `data-ng-click="advanceSlide()"` attribute. Including this attribute on any clickable element on your page will advance the user to the next slide as you have specified in the [study specification structure](#study-specification-structure). Without this attribute, there will be no way for participants to advance through your study.

### Adding Your Slide to the Routing File

With your HTML slide complete, add it to the routing file at `public/modules/core/config/core.client.routes.js`. Here's the end of that file that ships with the framework:

```
            .state('thank-you', {
                url: '/thank-you',
                templateUrl: 'modules/core/views/thank-you.client.view.html'
            });
    }
]);
```

To add an HTML file that you've created in the `public/modules/core/views/` directory called `credits.client.view.html`, and for this file to be accessible at the `/credits` URL, we'd simply add an entry to the end of the file as follows:

```
            .state('thank-you', {
                url: '/thank-you',
                templateUrl: 'modules/core/views/thank-you.client.view.html'
            })
            .state('credits', {
                url: '/credits',
                templateUrl: 'modules/core/views/credits.client.view.html'
            });
    }
]);
```

The very first argument to this call to the `state` function (here, `'credits'`) is the name by which you will refer to this slide in your [study specification structure](#study-specification-structure).

Finally, note that *adding new questionnaires to your study does not mean that you must create a new questionnaire HTML file*. Simply use the `"questionnaire"` name for your slide object in your [study specification structure](#study-specification-structure) and use the `data` property of the slide object to [describe the questionnaire](#questionnaire-slides). Everything else will be handled by the framework.

### Adding Your Slide to Your Study Specification Structure Document

By whichever means is easiest for you (either through a [GUI](http://docs.mongodb.org/ecosystem/tools/administration-interfaces/) or the [command line](https://docs.mongodb.org/manual/reference/)), edit your [study specification structure](#study-specification-structure) to include your new slide. As noted above, use the name you provided in the routing file to refer to your new slide in the structure document.

# Media Files

We are currently developing a means of video playback, but for now, only audio media excerpts are supported. The [Max helper application](#the-max-patches) controls the playback of these media files. In order to add new audio files for use in your study, you must:

1. Add information about the file to the MongoDB database.
2. Place the file in the location in which the Max application looks for media files.

## Adding a Media File to the MongoDB Database

Information about media files are stored in the MongoDB database just like study specification documents. Each media file has its own document in the `media` collection in the database. A typical file looks like this:

```
{ 
    "_id" : ObjectId("538b777e2212e1eda2ff48ab"), 
    "artist" : "Minnie Riperton", 
    "bpm" : null, 
    "comments" : null, 
    "emotion_tags" : [
        ObjectId("538bd9002212e1eda2ff5299")
    ], 
    "excerpt_end_time" : 205.54, 
    "excerpt_start_time" : 125.53, 
    "genres" : [
        ObjectId("538bd1e52212e1eda2ff5297")
    ], 
    "has_lyrics" : true, 
    "key" : null, 
    "label" : "H005", 
    "source" : null, 
    "title" : "Reasons", 
    "type" : "audio", 
    "year" : ISODate("1974-01-01T00:00:00.000+0000"), 
    "file" : ObjectId("538b8ae7352f20fbd59e20d2")
}
```

The only *required* properties that a media document in the database must have are `artist`, `title`, and `label`. `artist` and `title` are straightforward. The `label` is the a string that the Max application will use for finding and playing back the media excerpt. Here, then, Max will look for a `H005.wav` file if this media excerpt is selected for use in a session. In order to add your own media files, simply add a document to the `media` collection in the database (either through a [GUI](http://docs.mongodb.org/ecosystem/tools/administration-interfaces/) or the [command line](https://docs.mongodb.org/manual/reference/)), with at least the following information:

```
{
    artist: "Artist Name Here",
    title: "Media Title Here",
    label: "First Part of Excerpt Filename Here (without extension)"
}
```

## Max Application Media File Location

The Max application looks for files in the `EiMpatch/media/` directory. If you add an excerpt to the database with the label `"Bananarama"`, then, Max will expect to find the file `EiMpatch/media/Bananarama.wav`.

# Recorded Session Data

In the demo applicaiton, two types of data are collected, recorded, and saved during a session: the data in the `trialData` document/object, and the data recorded from the sensors.  

## `trialData` Data

`trialData` objects contain metadata *about* the experiment session as well as responses given by the participant during the session. The metadata contain, for instance, the date and time of the session, as well as a copy of the study specification structure that was used to generate the session. Every `trialData` object is associated with a UUID (universally unique identifier) generated by the applicaiton. Upon completion of a session, a JSON file containing the `trialData` object for the session is stored in the `trials/` directory.

## Sensor Data

Sensor data is collected, recorded, and saved by the Max helper application. A sensor data file is generated for every media excerpt playback, and these files are stored in the `EiMpatch/data/` directory. As an example, if the UUID `92a7d913-63d7-4e37-af01-a6ca19ae2be3` was generated by the application for a specific participant, the following files would be generated from the session:

```
# The sensor data files for media excerpts labeled "C002" and "T018":
.\EiMpatch\data\92a7d913-63d7-4e37-af01-a6ca19ae2be3_C002.txt
.\EiMpatch\data\92a7d913-63d7-4e37-af01-a6ca19ae2be3_T018.txt

# The trialData JSON file:
.\trials\92a7d913-63d7-4e37-af01-a6ca19ae2be3.trial.json
```

### Sensor Data File Format

In the demo app, sensor data is recorded into space-delimited CSV files with a single-line header giving the names of each column.

# Helper Programs

## The Max Patches

## The Arduino Patches

# Internationalization

The use of the `translate` directive in any of your [HTML code](#constructing-the-html-file-for-your-slide) will automatically translate the enclosed text to the language that the participant has selected. For this to work correctly, several things must be in place. We'll discuss these in terms of adding new text and translations for which the target language is already available as an option in the header menu, and adding a new language option to the menu itself.

## Adding New Translated Text

If your target language is already available in the header menu, you'll need to generate a translation file for all strings in the application for your target language. We use the [angular-gettext](https://angular-gettext.rocketeer.be/) tool for integrating internationalization into the application. angular-gettext provides an extraction tool for extracting all strings in the application that require translation, and a compilation tool for including translations in the application once the strings have been translated.

### Extracting Strings for Translation

To extract strings for translation, simply run

```
node_modules\grunt-cli\bin\grunt nggettext_extract
```

This will produce the file `po\template.pot`. The `.pot` file contains entries for every string present in the application and can be used with a number of software tools or web services (we use [Crowdin](https://crowdin.com/)) to generate a `.po` file. a `.po` file contains the *translations* of all strings into a specific language.

The `.pot` file will extract all strings from all HTML pages included in your application. If, however, you have included text that is not directly part of an HTML page, but is included in one *through your modifications of the study specification document* (e.g., checkbox labels, etc.), you'll need to make a couple of changes before running the command to extract strings. To include these strings, they must be present in the `public\modules\core\config\core.client.missing-keys.js` file. This is what the *bottom* of that file may look like
 
```
        gettext('119');
        gettext('120');
        gettext('121');
        gettext('Begin Playback');
    }
]);
```

Here, `'119'`, `'120'`, `'121'`, and `'Begin Playback'` are all strings that are not directly written into an HTML file in the application. If we also need to include the string, `'Good Morning!'` for translation, we would simply add it to the bottom of the file as follows

```
        gettext('119');
        gettext('120');
        gettext('121');
        gettext('Begin Playback');
        gettext('Good Morning!');
    }
]);
```

This change will now include `'Good Morning!'` for translation when `node_modules\grunt-cli\bin\grunt nggettext_extract` is run.

If you're wondering whether or not you've included all such strings in the `core.client.missing-keys.js` file, they are easy to find. By default, angular-gettext's debug mode is enabled. When this is the case, when a user has selected a particular language from the header menu and a string is used in the application for which there is not translation, the string will be prepended with `[MISSING]: `. This indicates that the string that follows `[MISSING]: ` should be included in the `core.client.missing-keys.js` file. To make sure you've included all 'missing' strings for translation, simply select the target language and go through the study, looking for any `[MISSING]: ` indicators.

Once you've generated a `.pot` file and used software or a web service to translate all the strings it contains, you'll be able to export a `.po` file. To compile these translations into your application, simply put the `.po` file in to the `po/` directory, and run

```
node_modules\grunt-cli\bin\grunt nggettext_compile
```

If and when this command completes successfully, the translations you provided in your `.po` file will be available to the application.

## Adding New Languages

If your target language for translation is not available in the dropdown menu from the header, it is straightforward to edit the application to make it available for your participants. To do so, edit the `public\modules\core\views\header.client.view.html` file. The `<li>...</li>` sections represent the languages available in the dropdown menu. Here is the line that makes Taiwanese available as a selection

```
<li><a ng-click="setLanguage('zh_TW')">中文</a></li>
```

Here, the string inside the parentheses should match the name of the `.po` file (you'll see in the demo app that a translation file is available for Taiwanese at `po/zh_TW.po`.) The text inside of the `<a ...></a>` tag gives the textual label that the participant will see in the dropdown list itself (here, '中文'). To add a language option for Zulu, then, we would need to add the file `po/zu.po`, and the following line to `public\modules\core\views\header.client.view.html`

```
<li><a ng-click="setLanguage('zu')">Zulu</a></li>
```

## Setting the Default Language

The default language for your application is set in `public/application.js`. The demo app ships with English as the default language, as set by this line

```
gettextCatalog.setCurrentLanguage('en');
```

To choose a new default language, change `'en'` to be the language you would like to be the default (starting) language. For instance, to change this to use our Taiwanese translation as the default language, we would change this line to

```
gettextCatalog.setCurrentLanguage('zh_TW');
```

The default language only governs the language used when the first screen is initially loaded. After this point, participants are free to change the language using the dropdown menu in the header.

# Building a Production Version of Your Study Application

Running the application with `node_modules/grunt-cli/bin/grunt` starts a Node.js web server. By default, this runs in *development* mode, which can be considerably slower than running in *production* mode. Running in production mode requires that you have built a production-ready version of your application. To do so, run the following command from the root directory of the repository:

```
node_modules/grunt-cli/bin/grunt build
```

Once this successfully completes, use the following modification of the server startup command to run in production mode:

```
NODE_ENV=production node_modules/grunt-cli/bin/grunt
```

# Adding Custom Directives

AngularJS directives provide much of the *special sauce* in the Emotion in Motion framework; they are, for instance, how questionnaires are automatically built based on the information you provide in the study specification structure document. There's plenty more that one can accomplish with additional custom directives, and we encourage you to write your own (and [submit them](#contributing-changes) for the rest of us to use!). To do so, you'll need to get your feet wet with [AngularJS](https://angularjs.org), but feel free to look through what we've already written in `public/modules/core/directives/` to get started.

# Contributing Changes

The development of the Emotion in Motion framework is still in its early stages. If you would like to contribute to this ongoing work, please [submit a pull request](https://github.com/brennon/eim/pulls)!

If you do make changes, please ensure that you've added the appropriate tests
. In addition, creating links to these pre- and post-commit git hooks will 
ensure that all tests are still passing before committing any changes:

```
# From the root directory of the repository:
ln -s ../../pre-commit.sh .git/hooks/pre-commit
ln -s ../../post-commit.sh .git/hooks/post-commit
```
