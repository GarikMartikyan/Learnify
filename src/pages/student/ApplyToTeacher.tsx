import { useState } from "react";
import { Button, Form, Input, message, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export function ApplyToTeacher() {
  const [fileList, setFileList] = useState([]);

  const onFinish = (values: any) => {
    if (fileList.length === 0) {
      message.error("Please upload a certificate before submitting.");
      return;
    }

    console.log("Submitted:", {
      ...values,
      certificate: fileList[0],
    });

    message.success("Application submitted successfully!");
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Title level={3}>Apply to Become a Teacher</Title>
        <Text type="secondary">
          Submit a short message explaining why you want to become a teacher and
          upload your certificate.
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          {/* Message */}
          <Form.Item
            label="Your Message"
            name="message"
            rules={[
              { required: true, message: "Please enter a message." },
              { min: 20, message: "Message must be at least 20 characters." },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Describe why you want to be a teacher…"
              style={{ resize: "none" }}
            />
          </Form.Item>

          {/* Certificate Upload */}
          <Form.Item
            label="Upload Your Certificate"
            required
            tooltip="Accepted formats: PDF, JPG, PNG"
          >
            <Upload
              beforeUpload={() => false} // prevent automatic upload
              accept=".pdf,.jpg,.jpeg,.png"
              fileList={fileList}
              onChange={({ fileList: newList }) => setFileList(newList)}
            >
              <Button icon={<UploadOutlined />}>Upload Certificate</Button>
            </Upload>
          </Form.Item>

          {/* Submit */}
          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
