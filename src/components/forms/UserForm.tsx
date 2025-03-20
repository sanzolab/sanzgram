import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { ProfileValidation } from "@/lib/validations";
import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Loader from "../shared/Loader";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
// import { useNavigate } from 'react-router-dom'
import { Textarea } from "../ui/textarea";

interface UserFormProps {
  user: IUser;
}
const UserForm = ({ user }: UserFormProps) => {
  // const navigate = useNavigate()
  const { mutateAsync: updateUser, isPending: isLoadingUpdateUser } =
    useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user ? user.name : "",
      username: user ? user.username : "",
      email: user ? user.email : "",
      bio: user ? user.bio : "",
    },
  });
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    const updatedUser = await updateUser({
      ...values,
      userId: user.id,
      imageId: user.imageId,
      imageUrl: user.imageUrl,
    });
    if (!updatedUser) {
      toast({
        title: "There was an error updating the profile, Please try again",
      });
    }
    // return navigate(`/post/${user.$id}`)

    // navigate('/')
  }
  return (
    <div className="w-full relative flex justify-center align-middle">
      {isLoadingUpdateUser && (
        <div className="flex-center gap-2 absolute bottom-0 left-0 right-0 top-0 grid place-items-center z-20">
          <Loader />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col gap-9 w-full max-w-5xl ${
            isLoadingUpdateUser && "opacity-30"
          }`}
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormControl className="max-w-[60%] flex flex-row bg-transparent">
                  <FileUploader
                    type="profile"
                    fieldChange={field.onChange}
                    mediaUrl={user?.imageUrl}
                  />
                </FormControl>

                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="John Doe, Bob She, ...."
                    {...field}
                  />
                </FormControl>

                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="John Doe, Bob She, ...."
                    {...field}
                  />
                </FormControl>

                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isLoadingUpdateUser}
            >
              {isLoadingUpdateUser && (
                <div className="flex-center gap-2 absolute bottom-0 left-0 right-0 top-0 grid place-items-center z-20">
                  <Loader />
                </div>
              )}
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
