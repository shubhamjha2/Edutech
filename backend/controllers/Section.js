const Section = require("../models/Section");
const Course = require("../models/Course");
const Subsection = require("../models/Subsection");
// CREATE a new section
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body;

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName });

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // Handle errors
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error in creating section",
      error: error.message,
    });
  }
};

// UPDATE a section
// exports.updateSection = async (req, res) => {
//   try {
//     const { sectionName, sectionId } = req.body;
//     const section = await Section.findByIdAndUpdate(
//       sectionId,
//       { sectionName },
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: section,
//     });
//   } catch (error) {
//     console.error("Error updating section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: section,
      data: course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE a section
// exports.deleteSection = async (req, res) => {
//   try {
//     console.log("inside delete section try block");
//     //HW -> req.params -> test
//     const { sectionId, courseId } = req.body;
//     await Course.findByIdAndUpdate(courseId, {
//       $pull: {
//         courseContent: sectionId,
//       },
//     });
//     const section = await Section.findById(sectionId);
//     console.log(sectionId, courseId);
//     if (!section) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not Found",
//       });
//     }

//     await SubSection.deleteMany({ _id: { $in: section.subSection } });
//     await Section.findByIdAndDelete(sectionId);

//     const course = await Course.findById(courseId)
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();
//   } catch (error) {
// 	console.log("inside delete section catch block");
//     console.error("Error deleting section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
// exports.deleteSection = async (req, res) => {
//   try {
//     console.log("Inside delete section try block");

//     // Validate the request body
//     const { sectionId, courseId } = req.body;
//     if (!sectionId || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Both sectionId and courseId are required in the request body.",
//       });
//     }

//     // Use await for all asynchronous operations
//     await Course.findByIdAndUpdate(courseId, {
//       $pull: {
//         courseContent: sectionId,
//       },
//     });

//     // Check if the section exists
//     const section = await Section.findById(sectionId);
//     if (!section) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not found",
//       });
//     }

//     // Delete related subSections
//     await SubSection.deleteMany({ _id: { $in: section.subSection } });

//     // Delete the section itself
//     await Section.findByIdAndDelete(sectionId);

//     // Find the updated course
//     const course = await Course.findById(courseId)
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     console.log("Section deleted successfully");
//     res.status(200).json({
//       success: true,
//       message: "Section deleted successfully",
//       course: course, // You can send the updated course as a response if needed
//     });
//   } catch (error) {
//     console.log("Inside delete section catch block");
//     console.error("Error deleting section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    // await SubSection.deleteMany({ _id: { $in: section.subSection } });
    // await subSection.deleteMany({ _id: { $in: section.subSection } });
    await Subsection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
