import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { HelpCircle, Upload, Star, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { blogFormSchema } from "@/features/blog/schema";
import { useCategories } from "@/features/categories/hooks";
import { useTags } from "@/features/tags/hooks";
import { uploadCoverImage } from "@/features/blog/api";

const STEPS = [
  { id: 1, label: "Article Content & Editors", fields: ["title", "excerpt", "content"] },
  {
    id: 2,
    label: "Metadata & Media",
    fields: ["coverImage", "categoryIds", "tagIds", "seoTitle", "seoDescription", "canonicalUrl"],
  },
  { id: 3, label: "Publish", fields: [] },
];

export default function BlogForm({ defaultValues, onSubmit, isSubmitting, submitLabel }) {
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      categoryIds: [],
      tagIds: [],
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      isFeatured: false,
      ...defaultValues,
    },
  });

  const coverImage = watch("coverImage");
  const values = watch();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadCoverImage(file);
      setValue("coverImage", media.url, { shouldValidate: true });
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const goNext = async () => {
    const current = STEPS.find((s) => s.id === step);
    const valid = await trigger(current.fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const goToStep = (targetId) => {
    if (targetId < step) setStep(targetId);
  };

  const onInvalid = (formErrors) => {
    const errorFields = Object.keys(formErrors);
    const stepWithError = STEPS.find((s) => s.fields.some((f) => errorFields.includes(f)));
    if (stepWithError) setStep(stepWithError.id);
  };

  const selectedCategories = categories?.filter((c) => values.categoryIds?.includes(c.id)) ?? [];
  const selectedTags = tags?.filter((t) => values.tagIds?.includes(t.id)) ?? [];

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Step Progress Bar */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => goToStep(s.id)}
              disabled={s.id >= step}
              className={`flex items-center gap-2 ${s.id < step ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs transition-colors ${
                  s.id === step
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : s.id < step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {s.id < step ? <Check className="h-3.5 w-3.5" /> : s.id}
              </div>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  s.id === step
                    ? "text-slate-900 dark:text-slate-100"
                    : s.id < step
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-400 font-semibold"
                }`}
              >
                {s.label}
              </span>
            </button>

            {i < STEPS.length - 1 && (
              <div
                className={`h-[1.5px] flex-1 max-w-[60px] mx-2 ${
                  s.id < step ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          {STEPS.find((s) => s.id === step)?.label}
        </h2>

        {/* Step 1: Article Content & Editors */}
        {step === 1 && (
          <>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <RichTextEditor
                  label="Post Title"
                  required={true}
                  placeholder="Enter blog post title..."
                  value={field.value}
                  onChange={field.onChange}
                  minRows={2}
                  simple={true}
                  allowSplit={false}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="excerpt"
              render={({ field }) => (
                <RichTextEditor
                  label="Short Summary / Excerpt"
                  required={false}
                  placeholder="Write a brief overview or key highlights summarizing the article..."
                  value={field.value}
                  onChange={field.onChange}
                  minRows={4}
                  simple={true}
                  allowSplit={true}
                  error={errors.excerpt?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  label="Article Content"
                  required={true}
                  placeholder="Write rich article content using headers, lists, code blocks, links, and markdown formatting..."
                  value={field.value}
                  onChange={field.onChange}
                  minRows={16}
                  simple={false}
                  allowSplit={true}
                  error={errors.content?.message}
                />
              )}
            />
          </>
        )}

        {/* Step 2: Metadata & Media */}
        {step === 2 && (
          <>
            {/* Cover Image Upload Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <label htmlFor="coverImageFile" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Cover Image
              </label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center hover:border-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-900">
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <input
                  id="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="text-xs text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-slate-800 cursor-pointer"
                />
                {uploading && <p className="mt-2 text-xs font-semibold text-emerald-600">Uploading cover image...</p>}
              </div>
              {coverImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 shadow-2xs max-w-sm">
                  <img src={coverImage} alt="Cover Preview" className="h-40 w-full object-cover" />
                </div>
              )}
              {errors.coverImage && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.coverImage.message}</p>}
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                Categories
              </label>
              <Controller
                control={control}
                name="categoryIds"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {categories?.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        <Checkbox
                          checked={field.value.includes(category.id)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked ? [...field.value, category.id] : field.value.filter((id) => id !== category.id)
                            );
                          }}
                          className="h-4 w-4 rounded-md border-slate-300 data-[state=checked]:bg-emerald-600"
                        />
                        {category.name}
                      </label>
                    ))}
                    {categories?.length === 0 && (
                      <p className="text-xs text-slate-400">No categories created yet.</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                Tags
              </label>
              <Controller
                control={control}
                name="tagIds"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {tags?.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        <Checkbox
                          checked={field.value.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? [...field.value, tag.id] : field.value.filter((id) => id !== tag.id));
                          }}
                          className="h-4 w-4 rounded-md border-slate-300 data-[state=checked]:bg-emerald-600"
                        />
                        {tag.name}
                      </label>
                    ))}
                    {tags?.length === 0 && <p className="text-xs text-slate-400">No tags created yet.</p>}
                  </div>
                )}
              />
            </div>

            {/* Featured Checkbox */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Checkbox
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-purple-600"
                    />
                  )}
                />
                <label htmlFor="isFeatured" className="cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Featured Post (Pin to top of blog section)
                </label>
              </div>
            </div>

            {/* SEO Details Card */}
            <details className="group rounded-2xl border border-slate-200 bg-slate-50/40 p-5 dark:border-slate-700 dark:bg-slate-800/40" open>
              <summary className="cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>SEO Settings (Optional)</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Expand ▾</span>
              </summary>
              <div className="mt-4 space-y-4 pt-3 border-t border-slate-200/80 dark:border-slate-700">
                <div>
                  <label htmlFor="seoTitle" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    SEO Title
                  </label>
                  <input
                    id="seoTitle"
                    {...register("seoTitle")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    SEO Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={2}
                    {...register("seoDescription")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="canonicalUrl" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    id="canonicalUrl"
                    {...register("canonicalUrl")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  {errors.canonicalUrl && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{errors.canonicalUrl.message}</p>
                  )}
                </div>
              </div>
            </details>
          </>
        )}

        {/* Step 3: Publish (Review) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Title</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{values.title || "—"}</p>
            </div>

            {coverImage && (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs max-w-sm dark:border-slate-700">
                <img src={coverImage} alt="Cover Preview" className="h-40 w-full object-cover" />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Categories</p>
                {selectedCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((c) => (
                      <span key={c.id} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                        {c.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">None selected</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Tags</p>
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((t) => (
                      <span key={t.id} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                        {t.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">None selected</p>
                )}
              </div>
            </div>

            {values.isFeatured && (
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                This post is marked as Featured
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review the details above, then {submitLabel?.toLowerCase() || "submit"} below.
            </p>
          </div>
        )}

        {/* Step Navigation */}
        <div className="flex items-center gap-3 pt-3">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold py-3.5 text-sm shadow-md transition-colors cursor-pointer dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold py-3.5 text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          )}
        </div>

        {/* Bottom Helper Link */}
        <div className="flex items-center justify-center pt-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            <HelpCircle className="h-3.5 w-3.5" /> Need Support?
          </span>
        </div>
      </form>
    </div>
  );
}
