class Test {
  constructor(folderGuid, testId, title, tabTitle, course, questions, criterias, metadata, IsAnyQstnEditMode) {
    this.id = "tab" + (new Date()).getTime();
    this.testId = testId;
    this.folderGuid = folderGuid;
    this.title = title;
    this.tabTitle = tabTitle;
    this.course = course;
    this.questions = questions;
    this.criterias = criterias;
    this.metadata = metadata;
    this.IsAnyQstnEditMode = IsAnyQstnEditMode;
  }
}

export default Test;