[![Build Status](https://travis-ci.org/brennon/eim.svg?branch=adding-tests)](https://travis-ci.org/brennon/eim) [![Dependency Status](https://david-dm.org/brennon/eim.png)](https://david-dm.org/brennon/eim.png)

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

4. Start `mongod` is started on the default port. If you installed with Homebrew:

    ```
    mongod --config /usr/local/etc/mongod.conf
    ```

3. Install [Node.js](https://nodejs.org/). Again, with Homebrew use:

    ```
    brew install node
    ```

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
    
5. Start the server. In the root directory of the repository:

    ```
    node_modules/grunt-cli/bin/grunt
    ```

6. Start the Max helper project located at `EiMpatch/EmotionInMotion.maxproj`. You'll need [Max 6](https://cycling74.com/) or later.
 
# Study Specification Structure
 
A study using Emotion in Motion is described by a MongoDB document (much like a JSON file) stored in the MongoDB database. Specifying study structures in this way essentially means that only knowledge of JSON is required in order to create a new study that requires only the modification of components already present in the provided demonstration study. JSON is a simple, textual format for representing structured data--see [this site](http://blog.scottlowe.org/2013/11/08/a-non-programmers-introduction-to-json/) for a gentle introduction. The default configuration presents a study with the following structure:

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

Much like the outer JSON object describes an overall study session, the `data` property of a `questionnaire`-`name`d slide describes a questionnaire-based slide itself. The `data` property takes an object as its value, and supports three properties on this object: `title`, `introductoryText`, and `structure`.

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

# To Write

- Recorded Data
- Media Location
- Adding Custom Directives
- Compiling
- Contributing Changes
- trialData Objects
- Internationalization