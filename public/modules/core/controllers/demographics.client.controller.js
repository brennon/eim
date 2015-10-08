'use strict';

/**
 * In the demo application, the `DemographicsController` was the primary
 * controller used for the `'demographics'` state. This controller provides
 * functionality for passing responses from the form in the demographics
 * state on to the {@link Angular.TrialData|TrialData} service. Note,
 * however, that in the demo application, the demographics questionnaire is
 * now dynamically generated using a `'questionnaire'` slide in the study
 * specification document (see the [README](index.html)). The
 * `DemographicsController` and
 * view are still here for you to use, however.
 *
 * @class Angular.DemographicsController
 */

angular.module('core').controller('DemographicsController', ['$scope', 'TrialData', '$log',
    function($scope, TrialData, $log) {

        $log.debug('Loading DemographicsController.');

        /**
         * The `DemographicsController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.DemographicsController
         * @type {{}}
         */

        /**
         * An array of nationalities.
         *
         * Every nationality in this array is
         * also included in the {@link Angular.MissingKeys|missing keys
         * file}. To make additional nationalities available, add them both
         * here and there.
         *
         * @name nationalities
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @type {string[]}
         */
        $scope.nationalities = ['Afghan', 'Albanian', 'Algerian', 'American',
            'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian',
            'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini',
            'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian',
            'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian',
            'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian',
            'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian',
            'Canadian', 'Cape Verdean', 'Central African', 'Chadian',
            'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese',
            'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish',
            'Djibouti', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean',
            'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean',
            'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French',
            'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek',
            'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean',
            'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian',
            'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian',
            'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican',
            'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan',
            'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian',
            'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian',
            'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian',
            'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian',
            'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan',
            'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican',
            'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan',
            'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish',
            'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian',
            'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish',
            'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan',
            'SaintLucian', 'Salvadoran', 'Samoan', 'San Marinese',
            'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian',
            'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian',
            'Slovenian', 'Solomon Islander', 'Somali', 'South African',
            'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer',
            'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik',
            'Tanzanian', 'Thai', 'Togolese', 'Tongan',
            'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan',
            'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan',
            'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'
        ];

        /**
         * An array of years.
         *
         * By default, this is a list of every year from one hundred years
         * before the current year up to and including the current year.
         *
         * @name years
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @type {number[]}
         */
        $scope.years = [];
        var thisYear = new Date().getFullYear();
        for (var i = thisYear; i >= thisYear - 110; i--) {
            $scope.years.push(i);
        }

        /**
         * Save nationality selection to the {@link
         * Angular.TrialData|TrialData} service.
         *
         * The value of `nationality` is converted to lower case and saved
         * in `TrialData.data.answers.nationality`.
         *
         * @function nationalityChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} nationality The new nationality
         * @return {undefined}
         */
        $scope.nationalityChanged = function(nationality) {
            $log.info('Nationality changed to ' + nationality + '.');
            TrialData.data.answers.nationality =
                nationality.toString().toLowerCase();
        };

        /**
         * Save year selection to the {@link Angular.TrialData|TrialData}
         * service.
         *
         * The value of `year` is converted to
         * `TrialData.data.answers.dob`.
         *
         * @function yearChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} year The new year
         * @return {undefined}
         */
        $scope.yearChanged = function(year) {
            $log.info('Year changed to ' + year + '.');
            TrialData.data.answers.dob = year;
        };

        /**
         * Save gender selection to the {@link Angular.TrialData|TrialData}
         * service.
         *
         * The value of `gender` is converted to
         * `TrialData.data.answers.sex`.
         *
         * @function genderChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} gender The new gender
         * @return {undefined}
         */
        $scope.genderChanged = function(gender) {
            $log.info('Gender changed to ' + gender + '.');
            TrialData.data.answers.sex = gender;
        };
    }
]);
