import { useState } from "react";
import { Button, Form, Input, message, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export function ApplyToTeacher() {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      console.log("Role change request submitted:", {
        ...values,
        fileList,
      });
      message.success("Your application has been submitted successfully!");
      form.resetFields();
      setFileList([]);
    }, 1000);
  };

  return (
    <div
      style={{
        borderRadius: 16,
      }}
    >
      <Title level={2}>Apply for Teacher Role</Title>
      <Paragraph style={{ fontSize: 16, color: "#555" }}>
        If you have experience teaching or a certification, you can apply to
        become a teacher on Learnify. Please provide a brief motivation message
        and upload a document or image that verifies your experience (for
        example, a diploma, certificate, or portfolio screenshot).
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        {/* Image Upload */}
        <Form.Item
          label="Upload Certificate or Verification Image"
          name="certificate"
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {/* Motivation Message */}
        <Form.Item
          label="Motivation Message"
          name="motivation"
          rules={[{ required: true, message: "Please write your motivation" }]}
        >
          <TextArea
            rows={5}
            placeholder="Tell us why you want to become a teacher and what subjects or skills you can teach..."
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ minWidth: 160 }}
          >
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
