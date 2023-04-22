const BASE_URL = 'http://192.168.1.142:8003/';
// const BASE_URL = 'http://www.labs.classadia.com:8004/'
// const BASE_URL = 'http://www.labs.classadia.com/';

export default BASE_URL;

export const URL_IMAGE_MY_PROFILE = BASE_URL + 'avatar/';
export const URL_IMAGE_SCHOOL = BASE_URL + 'logo/';
export const URL_IMAGE_ACTIVITY = BASE_URL + 'photo/';
export const URL_IMAGE_STUDENT_PHOTO = BASE_URL + 'photo/';
export const URL_IMAGE_POST = BASE_URL + 'activity/';
export const URL_ACTIVITY_COMMENT = BASE_URL + 'activity_comment/';

export const dummyData = [
  {
    id: 21,
    school_id: 1,
    stage: 'gg',
    sort: 1,
    created_by: 3,
    created_on: '2023-03-24T05:47:01.000Z',
    modified_by: null,
    modified_on: '2023-03-24T05:47:01.000Z',
    Grades: [],
  },
  {
    id: 19,
    school_id: 1,
    stage: 'demo',
    sort: 1,
    created_by: 3,
    created_on: '2023-03-16T10:28:16.000Z',
    modified_by: null,
    modified_on: null,
    Grades: [
      {
        id: 41,
        school_id: 1,
        title: 'demo',
        created_by: 3,
        created_on: '2023-03-16T10:28:23.000Z',
        modified_by: null,
        modified_on: null,
        stage_id: 19,
        ClassRooms: [
          {
            id: 41,
            school_id: 1,
            name: 'demo room',
            created_by: 3,
            created_on: '2023-03-16T10:28:36.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 41,
          },
        ],
      },
      {
        id: 42,
        school_id: 1,
        title: 'grade',
        created_by: 3,
        created_on: '2023-03-24T05:43:02.000Z',
        modified_by: null,
        modified_on: '2023-03-24T05:43:02.000Z',
        stage_id: 19,
        ClassRooms: [
          {
            id: 43,
            school_id: 1,
            name: 'gg',
            created_by: 3,
            created_on: '2023-03-24T05:43:08.000Z',
            modified_by: null,
            modified_on: '2023-03-24T05:43:08.000Z',
            grade_id: 42,
          },
          {
            id: 44,
            school_id: 1,
            name: 'hh',
            created_by: 3,
            created_on: '2023-03-24T05:43:18.000Z',
            modified_by: null,
            modified_on: '2023-03-24T05:43:18.000Z',
            grade_id: 42,
          },
        ],
      },
    ],
  },
  {
    id: 17,
    school_id: 1,
    stage: 'first',
    sort: 1,
    created_by: 3,
    created_on: '2023-03-13T04:34:35.000Z',
    modified_by: null,
    modified_on: null,
    Grades: [
      {
        id: 39,
        school_id: 1,
        title: 'first grade',
        created_by: 3,
        created_on: '2023-03-13T04:35:43.000Z',
        modified_by: null,
        modified_on: null,
        stage_id: 17,
        ClassRooms: [
          {
            id: 42,
            school_id: 1,
            name: 'class 1 mijne',
            created_by: 3,
            created_on: '2023-03-21T06:39:50.000Z',
            modified_by: 3,
            modified_on: '2023-03-21T06:48:04.000Z',
            grade_id: 39,
          },
          {
            id: 37,
            school_id: 1,
            name: 'grade 1',
            created_by: 3,
            created_on: '2023-03-13T04:35:58.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 39,
          },
          {
            id: 40,
            school_id: 1,
            name: 'room2',
            created_by: 3,
            created_on: '2023-03-16T10:27:20.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 39,
          },
        ],
      },
    ],
  },
  {
    id: 20,
    school_id: 1,
    stage: 'new',
    sort: 1,
    created_by: 3,
    created_on: '2023-03-24T05:45:44.000Z',
    modified_by: null,
    modified_on: '2023-03-24T05:45:44.000Z',
    Grades: [
      {
        id: 44,
        school_id: 1,
        title: 'grade',
        created_by: 3,
        created_on: '2023-03-24T05:46:34.000Z',
        modified_by: null,
        modified_on: '2023-03-24T05:46:34.000Z',
        stage_id: 20,
        ClassRooms: [],
      },
      {
        id: 43,
        school_id: 1,
        title: 'nre',
        created_by: 3,
        created_on: '2023-03-24T05:45:54.000Z',
        modified_by: null,
        modified_on: '2023-03-24T05:45:54.000Z',
        stage_id: 20,
        ClassRooms: [
          {
            id: 45,
            school_id: 1,
            name: 'room',
            created_by: 3,
            created_on: '2023-03-24T05:46:21.000Z',
            modified_by: null,
            modified_on: '2023-03-24T05:46:21.000Z',
            grade_id: 43,
          },
        ],
      },
    ],
  },
  {
    id: 14,
    school_id: 1,
    stage: 'Primary',
    sort: 1,
    created_by: 451,
    created_on: '2023-03-09T17:37:52.000Z',
    modified_by: 451,
    modified_on: '2023-03-11T07:27:41.000Z',
    Grades: [
      {
        id: 29,
        school_id: 1,
        title: 'Grade 1',
        created_by: 451,
        created_on: '2023-03-09T18:25:57.000Z',
        modified_by: 451,
        modified_on: '2023-03-11T10:34:51.000Z',
        stage_id: 14,
        ClassRooms: [
          {
            id: 27,
            school_id: 1,
            name: 'Grade 1a',
            created_by: 451,
            created_on: '2023-03-11T10:01:41.000Z',
            modified_by: 451,
            modified_on: '2023-03-11T10:35:01.000Z',
            grade_id: 29,
          },
          {
            id: 29,
            school_id: 1,
            name: 'Grade 1b',
            created_by: 451,
            created_on: '2023-03-11T10:35:13.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 29,
          },
          {
            id: 28,
            school_id: 1,
            name: 'Grade 1c',
            created_by: 451,
            created_on: '2023-03-11T10:35:07.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 29,
          },
          {
            id: 30,
            school_id: 1,
            name: 'Grade 1d',
            created_by: 451,
            created_on: '2023-03-11T10:35:44.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 29,
          },
        ],
      },
      {
        id: 38,
        school_id: 1,
        title: 'Grade 2',
        created_by: 451,
        created_on: '2023-03-11T09:44:41.000Z',
        modified_by: 451,
        modified_on: '2023-03-11T10:14:35.000Z',
        stage_id: 14,
        ClassRooms: [
          {
            id: 32,
            school_id: 1,
            name: 'Grade 1b',
            created_by: 451,
            created_on: '2023-03-11T10:35:59.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 38,
          },
          {
            id: 33,
            school_id: 1,
            name: 'Grade 1c',
            created_by: 451,
            created_on: '2023-03-11T10:36:05.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 38,
          },
          {
            id: 34,
            school_id: 1,
            name: 'Grade 1d',
            created_by: 451,
            created_on: '2023-03-11T10:36:10.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 38,
          },
          {
            id: 31,
            school_id: 1,
            name: 'Grade 2a',
            created_by: 451,
            created_on: '2023-03-11T10:35:53.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 38,
          },
        ],
      },
      {
        id: 30,
        school_id: 1,
        title: 'Grade 3',
        created_by: 451,
        created_on: '2023-03-09T18:27:31.000Z',
        modified_by: 451,
        modified_on: '2023-03-11T10:14:29.000Z',
        stage_id: 14,
        ClassRooms: [
          {
            id: 35,
            school_id: 1,
            name: 'grade 1c',
            created_by: 451,
            created_on: '2023-03-11T10:36:38.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 30,
          },
          {
            id: 25,
            school_id: 1,
            name: 'Grade 3a',
            created_by: 3,
            created_on: '2023-02-08T09:29:50.000Z',
            modified_by: 451,
            modified_on: '2023-03-11T10:36:32.000Z',
            grade_id: 30,
          },
          {
            id: 26,
            school_id: 22,
            name: 'Grade 3b',
            created_by: 460,
            created_on: '2023-03-07T09:57:43.000Z',
            modified_by: 451,
            modified_on: '2023-03-11T10:36:26.000Z',
            grade_id: 30,
          },
          {
            id: 36,
            school_id: 1,
            name: 'Grade 3d',
            created_by: 451,
            created_on: '2023-03-11T10:36:56.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 30,
          },
        ],
      },
    ],
  },
  {
    id: 18,
    school_id: 1,
    stage: 'test',
    sort: 1,
    created_by: 3,
    created_on: '2023-03-16T06:17:05.000Z',
    modified_by: 3,
    modified_on: '2023-03-16T06:17:45.000Z',
    Grades: [
      {
        id: 40,
        school_id: 1,
        title: 'grade test',
        created_by: 3,
        created_on: '2023-03-16T06:18:18.000Z',
        modified_by: 3,
        modified_on: '2023-03-16T06:18:48.000Z',
        stage_id: 18,
        ClassRooms: [
          {
            id: 39,
            school_id: 1,
            name: 'new',
            created_by: 3,
            created_on: '2023-03-16T07:28:03.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 40,
          },
          {
            id: 38,
            school_id: 1,
            name: 'test room',
            created_by: 3,
            created_on: '2023-03-16T06:19:30.000Z',
            modified_by: null,
            modified_on: null,
            grade_id: 40,
          },
        ],
      },
    ],
  },
  {
    id: 15,
    school_id: 1,
    stage: 'Secondry',
    sort: 2,
    created_by: 451,
    created_on: '2023-03-09T18:33:10.000Z',
    modified_by: null,
    modified_on: null,
    Grades: [
      {
        id: 31,
        school_id: 1,
        title: 'Grade 6',
        created_by: 451,
        created_on: '2023-03-09T18:33:20.000Z',
        modified_by: 451,
        modified_on: '2023-03-11T09:48:12.000Z',
        stage_id: 15,
        ClassRooms: [],
      },
      {
        id: 32,
        school_id: 1,
        title: 'Grade 7',
        created_by: 451,
        created_on: '2023-03-09T19:18:43.000Z',
        modified_by: null,
        modified_on: null,
        stage_id: 15,
        ClassRooms: [],
      },
      {
        id: 33,
        school_id: 1,
        title: 'Grade 8',
        created_by: 451,
        created_on: '2023-03-09T19:18:50.000Z',
        modified_by: null,
        modified_on: null,
        stage_id: 15,
        ClassRooms: [],
      },
      {
        id: 34,
        school_id: 1,
        title: 'Grade 9',
        created_by: 451,
        created_on: '2023-03-09T19:18:57.000Z',
        modified_by: null,
        modified_on: null,
        stage_id: 15,
        ClassRooms: [],
      },
    ],
  },
  {
    id: 16,
    school_id: 1,
    stage: 'asdsadsad',
    sort: 2345,
    created_by: 451,
    created_on: '2023-03-11T07:27:53.000Z',
    modified_by: null,
    modified_on: null,
    Grades: [],
  },
];